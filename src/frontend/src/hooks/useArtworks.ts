import { useGetAllArtworks, useCreateArtwork, useDeleteArtwork } from './useQueries';

export function useArtworks() {
  const { data: artworks = [], isLoading } = useGetAllArtworks();
  const createMutation = useCreateArtwork();
  const deleteMutation = useDeleteArtwork();

  const createArtwork = async (name: string, coloredImage: Blob, hero: bigint) => {
    // Use the same image for both original and colored for simplicity
    await createMutation.mutateAsync({
      name,
      originalImage: coloredImage,
      coloredImage,
      hero,
    });
  };

  const deleteArtwork = async (artworkId: string) => {
    await deleteMutation.mutateAsync(artworkId);
  };

  return {
    artworks,
    isLoading,
    createArtwork,
    deleteArtwork,
    isCreating: createMutation.isPending,
    isDeleting: deleteMutation.isPending,
  };
}
