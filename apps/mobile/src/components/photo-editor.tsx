import { Image } from 'expo-image';
import * as ImagePicker from 'expo-image-picker';
import { useState } from 'react';
import { ActivityIndicator, Pressable, StyleSheet, View } from 'react-native';

import { ThemedText } from '@/components/themed-text';
import { Spacing } from '@/constants/theme';
import { useTheme } from '@/hooks/use-theme';
import { uploadProfilePhoto } from '@/lib/upload-photo';

const MAX_PHOTOS = 6;

interface PhotoEditorProps {
  photos: string[];
  onChange: (photos: string[]) => void;
}

/** Add, view, and remove profile photos. Uploads happen immediately; the
 *  resulting URL list is owned by the parent and saved with the profile. */
export function PhotoEditor({ photos, onChange }: PhotoEditorProps) {
  const theme = useTheme();
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleAdd() {
    setError(null);
    const permission = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (!permission.granted) {
      setError('Photo library access is needed to add a photo.');
      return;
    }
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ['images'],
      allowsEditing: true,
      aspect: [4, 5],
      quality: 0.8,
    });
    if (result.canceled) return;
    const asset = result.assets[0];
    if (!asset) return;

    setUploading(true);
    try {
      const url = await uploadProfilePhoto(asset);
      onChange([...photos, url]);
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Could not upload that photo.');
    } finally {
      setUploading(false);
    }
  }

  function handleRemove(url: string) {
    onChange(photos.filter((photo) => photo !== url));
  }

  const canAdd = photos.length < MAX_PHOTOS && !uploading;

  return (
    <View style={styles.wrapper}>
      <ThemedText type="smallBold">Photos</ThemedText>
      <View style={styles.grid}>
        {photos.map((url) => (
          <Pressable
            key={url}
            accessibilityRole="button"
            accessibilityLabel="Remove photo"
            onPress={() => handleRemove(url)}
            style={styles.tile}>
            <Image
              source={{ uri: url }}
              style={styles.photo}
              contentFit="cover"
              cachePolicy="memory-disk"
              recyclingKey={url}
              accessibilityLabel="Profile photo"
            />
            <View style={[styles.removeBadge, { backgroundColor: theme.text }]}>
              <ThemedText type="smallBold" style={{ color: theme.background }}>
                ×
              </ThemedText>
            </View>
          </Pressable>
        ))}

        {canAdd ? (
          <Pressable
            accessibilityRole="button"
            accessibilityLabel="Add photo"
            onPress={handleAdd}
            style={[styles.tile, styles.addTile, { borderColor: theme.backgroundSelected }]}>
            <ThemedText type="title" themeColor="textSecondary">
              +
            </ThemedText>
          </Pressable>
        ) : null}

        {uploading ? (
          <View style={[styles.tile, styles.addTile, { borderColor: theme.backgroundSelected }]}>
            <ActivityIndicator />
          </View>
        ) : null}
      </View>

      {error ? (
        <ThemedText type="small" style={{ color: theme.error }}>
          {error}
        </ThemedText>
      ) : null}
    </View>
  );
}

const styles = StyleSheet.create({
  wrapper: { gap: Spacing.two },
  grid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: Spacing.two,
  },
  tile: {
    width: 96,
    height: 120,
    borderRadius: Spacing.three,
  },
  photo: {
    width: 96,
    height: 120,
    borderRadius: Spacing.three,
  },
  addTile: {
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1.5,
    borderStyle: 'dashed',
  },
  removeBadge: {
    position: 'absolute',
    top: -6,
    right: -6,
    width: 24,
    height: 24,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
  },
});
