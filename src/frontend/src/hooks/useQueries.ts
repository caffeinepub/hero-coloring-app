import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useActor } from './useActor';
import type { Artwork, ArtworkId } from '../backend';

export function useGetOwnedArtworkIds() {
  const { actor, isFetching } = useActor();

  return useQuery<ArtworkId[]>({
    queryKey: ['ownedArtworkIds'],
    queryFn: async () => {
      if (!actor) return [];
      return actor.getOwnedArtworkIds();
    },
    enabled: !!actor && !isFetching,
  });
}

export function useGetArtwork(artworkId: ArtworkId | null) {
  const { actor, isFetching } = useActor();

  return useQuery<Artwork | null>({
    queryKey: ['artwork', artworkId],
    queryFn: async () => {
      if (!actor || !artworkId) return null;
      return actor.getArtwork(artworkId);
    },
    enabled: !!actor && !isFetching && !!artworkId,
  });
}

export function useGetAllArtworks() {
  const { actor, isFetching } = useActor();

  return useQuery<Artwork[]>({
    queryKey: ['allArtworks'],
    queryFn: async () => {
      if (!actor) return [];
      return actor.getAllArtworks();
    },
    enabled: !!actor && !isFetching,
  });
}

export function useCreateArtwork() {
  const { actor } = useActor();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({
      name,
      originalImage,
      coloredImage,
      hero,
    }: {
      name: string;
      originalImage: Blob;
      coloredImage: Blob;
      hero: bigint;
    }) => {
      if (!actor) throw new Error('Actor not available');

      const { ExternalBlob } = await import('../backend');
      const originalBlob = ExternalBlob.fromBytes(new Uint8Array(await originalImage.arrayBuffer()));
      const coloredBlob = ExternalBlob.fromBytes(new Uint8Array(await coloredImage.arrayBuffer()));

      return actor.createArtwork(name, originalBlob, coloredBlob, hero);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['ownedArtworkIds'] });
      queryClient.invalidateQueries({ queryKey: ['allArtworks'] });
    },
  });
}

export function useDeleteArtwork() {
  const { actor } = useActor();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (artworkId: ArtworkId) => {
      if (!actor) throw new Error('Actor not available');
      return actor.deleteArtwork(artworkId);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['ownedArtworkIds'] });
      queryClient.invalidateQueries({ queryKey: ['allArtworks'] });
    },
  });
}
