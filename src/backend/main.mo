import Map "mo:core/Map";
import Order "mo:core/Order";
import Array "mo:core/Array";
import Iter "mo:core/Iter";
import Principal "mo:core/Principal";
import Runtime "mo:core/Runtime";
import Text "mo:core/Text";
import Nat "mo:core/Nat";
import Set "mo:core/Set";
import Storage "blob-storage/Storage";
import MixinStorage "blob-storage/Mixin";
import AccessControl "authorization/access-control";
import MixinAuthorization "authorization/MixinAuthorization";

actor {
  include MixinStorage();

  let accessControlState = AccessControl.initState();
  include MixinAuthorization(accessControlState);

  type ArtworkId = Text;
  type HeroId = Nat;
  type ArtworkIdSet = Set.Set<ArtworkId>;

  module ArtworkIdSet {
    public func empty() : ArtworkIdSet {
      Set.empty<ArtworkId>();
    };
  };

  type Artwork = {
    id : ArtworkId;
    name : Text;
    artist : Principal;
    originalImage : Storage.ExternalBlob;
    coloredImage : Storage.ExternalBlob;
    hero : HeroId;
  };

  let artworks = Map.empty<ArtworkId, Artwork>();
  let userArtworks = Map.empty<Principal, ArtworkIdSet>();

  module Artwork {
    public func compare(artwork1 : Artwork, artwork2 : Artwork) : Order.Order {
      artwork1.id.compare(artwork2.id);
    };
  };

  func getAndValidateArtwork(id : ArtworkId) : Artwork {
    switch (artworks.get(id)) {
      case (null) { Runtime.trap("Artwork not found") };
      case (?artwork) { artwork };
    };
  };

  public shared ({ caller }) func createArtwork(
    name : Text,
    originalImage : Storage.ExternalBlob,
    coloredImage : Storage.ExternalBlob,
    hero : HeroId,
  ) : async ArtworkId {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can save artworks");
    };

    let artworkId = name.concat("_" # hero.toText());
    let artwork : Artwork = {
      id = artworkId;
      name;
      artist = caller;
      originalImage;
      coloredImage;
      hero;
    };

    artworks.add(artworkId, artwork);

    let currentArtworks = switch (userArtworks.get(caller)) {
      case (null) { ArtworkIdSet.empty() };
      case (?artworkSet) { artworkSet };
    };
    currentArtworks.add(artworkId);
    userArtworks.add(caller, currentArtworks);

    artworkId;
  };

  public query ({ caller }) func getArtwork(artworkId : ArtworkId) : async Artwork {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can view artworks");
    };

    let artwork = getAndValidateArtwork(artworkId);

    // Verify ownership - users can only view their own artworks
    if (caller != artwork.artist and not AccessControl.isAdmin(accessControlState, caller)) {
      Runtime.trap("Unauthorized: Can only view your own artworks");
    };

    artwork;
  };

  public query ({ caller }) func getOwnedArtworkIds() : async [ArtworkId] {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can view artworks");
    };
    switch (userArtworks.get(caller)) {
      case (null) { [] };
      case (?artworkSet) { artworkSet.values().toArray() };
    };
  };

  public shared ({ caller }) func deleteArtwork(artworkId : ArtworkId) : async () {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can delete artworks");
    };

    let artwork = getAndValidateArtwork(artworkId);

    // Verify ownership - users can only delete their own artworks
    if (caller != artwork.artist and not AccessControl.isAdmin(accessControlState, caller)) {
      Runtime.trap("Unauthorized: Can only delete your own artworks");
    };

    artworks.remove(artworkId);

    switch (userArtworks.get(caller)) {
      case (null) {
        Runtime.trap("Artwork collection not found for user");
      };
      case (?artworkSet) {
        artworkSet.remove(artworkId);
      };
    };
  };

  public query ({ caller }) func getHero(heroId : HeroId) : async HeroId {
    // Heroes 7-12 are premium and require user authentication
    if (heroId >= 7 and heroId <= 12) {
      if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
        Runtime.trap("Unauthorized: Premium hero requires user authentication");
      };
    };
    // Heroes 1-6 and 13+ are free for everyone including guests
    heroId;
  };

  public query ({ caller }) func getAllArtworks() : async [Artwork] {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can view artworks");
    };

    // Users can only see their own artworks, admins can see all
    if (AccessControl.isAdmin(accessControlState, caller)) {
      artworks.values().toArray().sort();
    } else {
      let ownedIds = switch (userArtworks.get(caller)) {
        case (null) { ArtworkIdSet.empty() };
        case (?artworkSet) { artworkSet };
      };

      let ownedArtworks = ownedIds.values().map(
        func(id) { artworks.get(id) }
      ).toArray();

      ownedArtworks.filter(
        func(artwork) {
          switch (artwork) {
            case (?_) { true };
            case (null) { false };
          };
        }
      ).map(
        func(artwork) {
          switch (artwork) {
            case (?a) { a };
            case (null) { Runtime.trap("Unexpected empty artwork") };
          };
        }
      ).sort();
    };
  };
};
