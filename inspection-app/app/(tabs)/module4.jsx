import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Alert,
  ActivityIndicator,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import * as Location from 'expo-location';
import * as Clipboard from 'expo-clipboard';

export default function Module4Screen() {
  const [location, setLocation] = useState(null);
  const [fetchedAt, setFetchedAt] = useState(null);
  const [loading, setLoading] = useState(false);
  const [copying, setCopying] = useState(false);

  const requestLocationPermission = async () => {
    const { status, canAskAgain } = await Location.requestForegroundPermissionsAsync();
    if (status !== 'granted') {
      Alert.alert(
        'Location Permission Required',
        canAskAgain
          ? 'FieldSync needs location access to tag inspection sites. Please allow location permission.'
          : 'Location permission was denied. Please enable it from your device Settings to fetch your location.'
      );
      return false;
    }
    return true;
  };

  const fetchLocation = async () => {
    setLoading(true);
    try {
      const hasPermission = await requestLocationPermission();
      if (!hasPermission) return;

      const servicesEnabled = await Location.hasServicesEnabledAsync();
      if (!servicesEnabled) {
        Alert.alert(
          'Location Services Disabled',
          'Please turn on GPS / Location services on your device and try again.'
        );
        return;
      }

      const position = await Location.getCurrentPositionAsync({
        accuracy: Location.Accuracy.High,
      });
      setLocation(position);
      setFetchedAt(new Date());
    } catch {
      Alert.alert('Location Error', 'Could not fetch your location. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleCopy = async () => {
    if (!location) return;
    setCopying(true);
    try {
      const { latitude, longitude } = location.coords;
      const text = `${latitude.toFixed(6)}, ${longitude.toFixed(6)}`;
      await Clipboard.setStringAsync(text);
      Alert.alert('Copied!', `Current location copied to clipboard:\n\n${text}`);
    } catch {
      Alert.alert('Copy Failed', 'Could not copy the location. Please try again.');
    } finally {
      setCopying(false);
    }
  };

  const formatTime = (date) => {
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

  const getAccuracyQuality = (accuracy) => {
    if (accuracy == null) return { label: 'Unknown', color: '#999' };
    if (accuracy <= 10) return { label: 'Excellent', color: '#28a745' };
    if (accuracy <= 30) return { label: 'Good', color: '#7cb342' };
    if (accuracy <= 100) return { label: 'Fair', color: '#ffc107' };
    return { label: 'Poor', color: '#dc3545' };
  };

  const coords = location?.coords;
  const quality = getAccuracyQuality(coords?.accuracy);

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Site Location</Text>
        <Text style={styles.headerSubtitle}>Module 4</Text>
      </View>

      <ScrollView contentContainerStyle={styles.scrollContent}>
        <View style={styles.card}>
          <Text style={styles.cardTitle}>GPS Location</Text>
          <Text style={styles.cardDescription}>
            Fetch your current GPS coordinates to tag the inspection site. You
            can refresh the reading or copy it to the clipboard.
          </Text>
        </View>

        {!location ? (
          <View style={styles.emptyState}>
            <Text style={styles.emptyIcon}>📍</Text>
            <Text style={styles.emptyTitle}>No Location Fetched</Text>
            <Text style={styles.emptyText}>
              Tap the button below to request permission and fetch your current
              GPS location.
            </Text>

            <TouchableOpacity
              style={[styles.fetchBtn, loading && styles.btnDisabled]}
              onPress={fetchLocation}
              disabled={loading}
            >
              {loading ? (
                <View style={styles.btnRow}>
                  <ActivityIndicator color="#fff" size="small" />
                  <Text style={styles.fetchBtnText}>  Fetching Location...</Text>
                </View>
              ) : (
                <Text style={styles.fetchBtnText}>Get Current Location</Text>
              )}
            </TouchableOpacity>
          </View>
        ) : (
          <View>
            <View style={styles.locationCard}>
              <View style={styles.coordRow}>
                <View style={styles.coordBox}>
                  <Text style={styles.coordLabel}>Latitude</Text>
                  <Text style={styles.coordValue}>{coords.latitude.toFixed(6)}</Text>
                </View>
                <View style={styles.coordBox}>
                  <Text style={styles.coordLabel}>Longitude</Text>
                  <Text style={styles.coordValue}>{coords.longitude.toFixed(6)}</Text>
                </View>
              </View>

              <View style={styles.accuracyRow}>
                <View style={styles.metaItem}>
                  <Text style={styles.metaLabel}>Accuracy</Text>
                  <Text style={styles.metaValue}>
                    {coords.accuracy != null ? `±${coords.accuracy.toFixed(1)} m` : 'N/A'}
                  </Text>
                </View>
                <View style={[styles.qualityBadge, { backgroundColor: quality.color }]}>
                  <Text style={styles.qualityBadgeText}>{quality.label}</Text>
                </View>
              </View>

              <View style={styles.metaFooter}>
                <Text style={styles.metaLabel}>Last Updated</Text>
                <Text style={styles.metaValue}>{formatTime(fetchedAt)}</Text>
              </View>
            </View>

            <TouchableOpacity
              style={[styles.copyBtn, copying && styles.btnDisabled]}
              onPress={handleCopy}
              disabled={copying}
            >
              <Text style={styles.copyBtnText}>
                {copying ? 'Copying...' : 'Copy Location to Clipboard'}
              </Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={[styles.refreshBtn, loading && styles.btnDisabled]}
              onPress={fetchLocation}
              disabled={loading}
            >
              {loading ? (
                <View style={styles.btnRow}>
                  <ActivityIndicator color="#007bff" size="small" />
                  <Text style={styles.refreshBtnText}>  Refreshing...</Text>
                </View>
              ) : (
                <Text style={styles.refreshBtnText}>Refresh Location</Text>
              )}
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
  header: {
    padding: 16,
    backgroundColor: '#f4f4f4',
    borderBottomWidth: 1,
    borderColor: '#ddd',
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  headerSubtitle: {
    fontSize: 13,
    color: '#007bff',
    fontWeight: '600',
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
  fetchBtn: {
    backgroundColor: '#007bff',
    paddingVertical: 14,
    paddingHorizontal: 32,
    borderRadius: 6,
    alignItems: 'center',
    alignSelf: 'stretch',
  },
  fetchBtnText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
  btnRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  locationCard: {
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 6,
    marginBottom: 16,
    overflow: 'hidden',
  },
  coordRow: {
    flexDirection: 'row',
  },
  coordBox: {
    flex: 1,
    padding: 16,
    alignItems: 'center',
    borderBottomWidth: 1,
    borderColor: '#eee',
  },
  coordLabel: {
    fontSize: 11,
    color: '#999',
    textTransform: 'uppercase',
    fontWeight: '600',
    marginBottom: 4,
  },
  coordValue: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#007bff',
  },
  accuracyRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 12,
    backgroundColor: '#fafafa',
    borderBottomWidth: 1,
    borderColor: '#eee',
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
  qualityBadge: {
    paddingVertical: 4,
    paddingHorizontal: 10,
    borderRadius: 4,
  },
  qualityBadgeText: {
    color: '#fff',
    fontSize: 12,
    fontWeight: 'bold',
  },
  metaFooter: {
    padding: 12,
    backgroundColor: '#fafafa',
  },
  copyBtn: {
    backgroundColor: '#28a745',
    padding: 14,
    borderRadius: 6,
    alignItems: 'center',
    marginBottom: 10,
  },
  copyBtnText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
  refreshBtn: {
    padding: 14,
    borderRadius: 6,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#007bff',
    marginBottom: 20,
  },
  refreshBtnText: {
    color: '#007bff',
    fontSize: 14,
    fontWeight: '600',
  },
  btnDisabled: {
    opacity: 0.6,
  },
});
