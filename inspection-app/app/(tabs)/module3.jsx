import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Alert,
  Image,
  ActivityIndicator,
  Platform,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import * as ImagePicker from 'expo-image-picker';
import * as MediaLibrary from 'expo-media-library';

export default function Module3Screen() {
  const [photo, setPhoto] = useState(null);
  const [capturedAt, setCapturedAt] = useState(null);
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [savedToGallery, setSavedToGallery] = useState(false);

  const requestCameraPermission = async () => {
    if (Platform.OS === 'web' && typeof navigator !== 'undefined' && navigator.mediaDevices) {
      try {
        const stream = await navigator.mediaDevices.getUserMedia({ video: true });
        stream.getTracks().forEach((t) => t.stop());
        return true;
      } catch {
        Alert.alert(
          'Camera Permission Required',
          'FieldSync needs camera access to capture inspection photos. Please allow camera permission in your browser.'
        );
        return false;
      }
    }
    const { status, canAskAgain } = await ImagePicker.requestCameraPermissionsAsync();
    if (status !== 'granted') {
      Alert.alert(
        'Camera Permission Required',
        canAskAgain
          ? 'FieldSync needs camera access to capture inspection photos. Please allow camera permission.'
          : 'Camera permission was denied. Please enable it from your device Settings to capture photos.'
      );
      return false;
    }
    return true;
  };

  const openCamera = async () => {
    const isWeb = Platform.OS === 'web' && typeof navigator !== 'undefined' && navigator.mediaDevices;

    if (isWeb) {
      setLoading(true);
      try {
        const stream = await navigator.mediaDevices.getUserMedia({ video: true });
        const video = document.createElement('video');
        video.style.position = 'fixed';
        video.style.top = '-9999px';
        video.style.opacity = '0';
        document.body.appendChild(video);
        video.srcObject = stream;
        await video.play();

        const canvas = document.createElement('canvas');
        canvas.width = video.videoWidth || 640;
        canvas.height = video.videoHeight || 480;

        await new Promise((resolve) => { setTimeout(resolve, 600); });

        const ctx = canvas.getContext('2d');
        ctx.drawImage(video, 0, 0);
        stream.getTracks().forEach((t) => t.stop());
        document.body.removeChild(video);

        const dataUrl = canvas.toDataURL('image/jpeg', 0.8);
        setPhoto({ uri: dataUrl, width: canvas.width, height: canvas.height });
        setCapturedAt(new Date());
        setSavedToGallery(false);
      } catch (err) {
        Alert.alert('Camera Error', err.message || 'Could not access webcam.');
      }
      setLoading(false);
      return;
    }

    setLoading(true);
    try {
      const hasPermission = await requestCameraPermission();
      if (!hasPermission) return;

      const result = await ImagePicker.launchCameraAsync({
        mediaTypes: ['images'],
        allowsEditing: false,
        quality: 0.8,
      });

      if (!result.canceled && result.assets?.length > 0) {
        setPhoto(result.assets[0]);
        setCapturedAt(new Date());
        setSavedToGallery(false);
      }
    } catch {
      Alert.alert('Camera Error', 'Could not open the camera. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleRetake = () => {
    openCamera();
  };

  const handleDelete = () => {
    Alert.alert(
      'Delete Photo',
      'Are you sure you want to delete this photo? This action cannot be undone.',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Delete',
          style: 'destructive',
          onPress: () => {
            setPhoto(null);
            setCapturedAt(null);
            setSavedToGallery(false);
          },
        },
      ]
    );
  };

  const handleSaveToGallery = async () => {
    if (!photo) return;
    if (Platform.OS === 'web') {
      Alert.alert('Not Supported', 'Saving to gallery is not supported on web.');
      return;
    }
    setSaving(true);
    try {
      const { status, canAskAgain } = await MediaLibrary.requestPermissionsAsync(true);
      if (status !== 'granted') {
        Alert.alert(
          'Gallery Permission Required',
          canAskAgain
            ? 'FieldSync needs permission to save photos to your gallery.'
            : 'Gallery permission was denied. Please enable it from your device Settings.'
        );
        return;
      }
      await MediaLibrary.saveToLibraryAsync(photo.uri);
      setSavedToGallery(true);
      Alert.alert('Saved', 'Photo saved to your gallery successfully!');
    } catch {
      Alert.alert('Save Failed', 'Could not save the photo to your gallery. Please try again.');
    } finally {
      setSaving(false);
    }
  };

  const formatCaptureTime = (date) => {
    if (!date) return '';
    return date.toLocaleString(undefined, {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit',
    });
  };

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollContent}>
        <View style={styles.card}>
          <Text style={styles.cardTitle}>Inspection Photo</Text>
          <Text style={styles.cardDescription}>
            Capture a photo of the inspection site. You can preview, retake,
            save it to your gallery, or delete it.
          </Text>
        </View>

        {!photo ? (
          <View style={styles.emptyState}>
            <Text style={styles.emptyIcon}>📷</Text>
            <Text style={styles.emptyTitle}>No Photo Captured</Text>
            <Text style={styles.emptyText}>
              Tap the button below to open the camera and capture a site photo.
            </Text>

            <TouchableOpacity
              style={[styles.captureBtn, loading && styles.btnDisabled]}
              onPress={openCamera}
              disabled={loading}
            >
              {loading ? (
                <View style={styles.btnRow}>
                  <ActivityIndicator color="#fff" size="small" />
                  <Text style={styles.captureBtnText}>  Opening Camera...</Text>
                </View>
              ) : (
                <Text style={styles.captureBtnText}>Capture Photo</Text>
              )}
            </TouchableOpacity>
          </View>
        ) : (
          <View>
            <View style={styles.previewCard}>
              <Image
                source={{ uri: photo.uri }}
                style={styles.previewImage}
                resizeMode="cover"
              />

              <View style={styles.metaRow}>
                <View style={styles.metaItem}>
                  <Text style={styles.metaLabel}>Captured At</Text>
                  <Text style={styles.metaValue}>{formatCaptureTime(capturedAt)}</Text>
                </View>
                {savedToGallery && (
                  <View style={styles.savedBadge}>
                    <Text style={styles.savedBadgeText}>✓ Saved to Gallery</Text>
                  </View>
                )}
              </View>
            </View>

            <TouchableOpacity
              style={[styles.saveBtn, (saving || savedToGallery) && styles.btnDisabled]}
              onPress={handleSaveToGallery}
              disabled={saving || savedToGallery}
            >
              {saving ? (
                <View style={styles.btnRow}>
                  <ActivityIndicator color="#fff" size="small" />
                  <Text style={styles.saveBtnText}>  Saving...</Text>
                </View>
              ) : (
                <Text style={styles.saveBtnText}>
                  {savedToGallery ? 'Saved to Gallery' : 'Save to Gallery'}
                </Text>
              )}
            </TouchableOpacity>

            <TouchableOpacity
              style={[styles.retakeBtn, loading && styles.btnDisabled]}
              onPress={handleRetake}
              disabled={loading}
            >
              {loading ? (
                <View style={styles.btnRow}>
                  <ActivityIndicator color="#007bff" size="small" />
                  <Text style={styles.retakeBtnText}>  Opening Camera...</Text>
                </View>
              ) : (
                <Text style={styles.retakeBtnText}>Retake Photo</Text>
              )}
            </TouchableOpacity>

            <TouchableOpacity style={styles.deleteBtn} onPress={handleDelete}>
              <Text style={styles.deleteBtnText}>Delete Photo</Text>
            </TouchableOpacity>
          </View>
        )}
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  scrollContent: {
    padding: 16,
  },
  card: {
    padding: 14,
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 6,
    marginBottom: 16,
  },
  cardTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 4,
  },
  cardDescription: {
    fontSize: 13,
    color: '#666',
  },
  emptyState: {
    alignItems: 'center',
    padding: 24,
    borderWidth: 1,
    borderColor: '#ccc',
    borderStyle: 'dashed',
    borderRadius: 6,
  },
  emptyIcon: {
    fontSize: 48,
    marginBottom: 12,
  },
  emptyTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 6,
    color: '#333',
  },
  emptyText: {
    fontSize: 13,
    color: '#666',
    textAlign: 'center',
    marginBottom: 20,
  },
  captureBtn: {
    backgroundColor: '#007bff',
    paddingVertical: 14,
    paddingHorizontal: 32,
    borderRadius: 6,
    alignItems: 'center',
    alignSelf: 'stretch',
  },
  captureBtnText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
  btnRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  previewCard: {
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 6,
    overflow: 'hidden',
    marginBottom: 16,
  },
  previewImage: {
    width: '100%',
    height: 320,
    backgroundColor: '#eee',
  },
  metaRow: {
    padding: 12,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: '#fafafa',
  },
  metaItem: {
    flex: 1,
  },
  metaLabel: {
    fontSize: 11,
    color: '#999',
    textTransform: 'uppercase',
    fontWeight: '600',
    marginBottom: 2,
  },
  metaValue: {
    fontSize: 13,
    color: '#333',
    fontWeight: '500',
  },
  savedBadge: {
    backgroundColor: '#e6f4ea',
    paddingVertical: 4,
    paddingHorizontal: 8,
    borderRadius: 4,
  },
  savedBadgeText: {
    color: '#28a745',
    fontSize: 12,
    fontWeight: '600',
  },
  saveBtn: {
    backgroundColor: '#28a745',
    padding: 14,
    borderRadius: 6,
    alignItems: 'center',
    marginBottom: 10,
  },
  saveBtnText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
  retakeBtn: {
    padding: 14,
    borderRadius: 6,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#007bff',
    marginBottom: 10,
  },
  retakeBtnText: {
    color: '#007bff',
    fontSize: 14,
    fontWeight: '600',
  },
  deleteBtn: {
    padding: 14,
    borderRadius: 6,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#dc3545',
    marginBottom: 20,
  },
  deleteBtnText: {
    color: '#dc3545',
    fontSize: 14,
    fontWeight: '600',
  },
  btnDisabled: {
    opacity: 0.6,
  },
});
