import React, { useState, useCallback } from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TextInput,
  TouchableOpacity,
  Alert,
  ActivityIndicator,
  RefreshControl,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import * as Contacts from 'expo-contacts';
import * as Clipboard from 'expo-clipboard';

const AVATAR_COLORS = ['#007bff', '#28a745', '#fd7e14', '#6f42c1', '#dc3545', '#17a2b8'];

export default function Module5Screen() {
  const [contacts, setContacts] = useState([]);
  const [hasFetched, setHasFetched] = useState(false);
  const [loading, setLoading] = useState(false);
  const [refreshing, setRefreshing] = useState(false);
  const [search, setSearch] = useState('');

  const requestContactsPermission = async () => {
    const { status, canAskAgain } = await Contacts.requestPermissionsAsync();
    if (status !== 'granted') {
      Alert.alert(
        'Contacts Permission Required',
        canAskAgain
          ? 'FieldSync needs access to your contacts to assign site inspectors. Please allow contacts permission.'
          : 'Contacts permission was denied. Please enable it from your device Settings to view contacts.'
      );
      return false;
    }
    return true;
  };

  const loadContacts = async (isRefresh = false) => {
    if (isRefresh) {
      setRefreshing(true);
    } else {
      setLoading(true);
    }
    try {
      const hasPermission = await requestContactsPermission();
      if (!hasPermission) return;

      const { data } = await Contacts.getContactsAsync({
        fields: [Contacts.Fields.Name, Contacts.Fields.PhoneNumbers],
        sort: Contacts.SortTypes.FirstName,
      });
      setContacts(data ?? []);
      setHasFetched(true);
    } catch {
      Alert.alert('Contacts Error', 'Could not load your contacts. Please try again.');
    } finally {
      if (isRefresh) {
        setRefreshing(false);
      } else {
        setLoading(false);
      }
    }
  };

  const onRefresh = useCallback(() => {
    loadContacts(true);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const getPhoneNumber = (contact) => {
    const numbers = contact.phoneNumbers;
    if (!numbers || numbers.length === 0) return null;
    return numbers[0]?.number ?? null;
  };

  const handleCopyNumber = (contact) => {
    const number = getPhoneNumber(contact);
    if (!number) {
      Alert.alert('No Number', `${contact.name || 'This contact'} has no phone number to copy.`);
      return;
    }
    Clipboard.setStringAsync(number)
      .then(() => {
        Alert.alert('Copied!', `${contact.name || 'Contact'}'s number copied to clipboard:\n\n${number}`);
      })
      .catch(() => {
        Alert.alert('Copy Failed', 'Could not copy the number. Please try again.');
      });
  };

  const getInitials = (name) => {
    if (!name || !name.trim()) return '?';
    const parts = name.trim().split(/\s+/);
    if (parts.length === 1) return parts[0][0].toUpperCase();
    return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase();
  };

  const getAvatarColor = (name) => {
    const str = name || '?';
    let hash = 0;
    for (let i = 0; i < str.length; i++) {
      hash = (hash * 31 + str.charCodeAt(i)) % 100000;
    }
    return AVATAR_COLORS[hash % AVATAR_COLORS.length];
  };

  const query = search.trim().toLowerCase();
  const filteredContacts = query
    ? contacts.filter((c) => {
        const nameMatch = (c.name || '').toLowerCase().includes(query);
        const numberMatch = (c.phoneNumbers || []).some((p) =>
          (p.number || '').replace(/[\s-()]/g, '').includes(query.replace(/[\s-()]/g, ''))
        );
        return nameMatch || numberMatch;
      })
    : contacts;

  const renderContact = ({ item }) => {
    const number = getPhoneNumber(item);
    return (
      <View style={styles.contactItem}>
        <View style={[styles.avatar, { backgroundColor: getAvatarColor(item.name) }]}>
          <Text style={styles.avatarText}>{getInitials(item.name)}</Text>
        </View>

        <View style={styles.contactInfo}>
          <Text style={styles.contactName} numberOfLines={1}>
            {item.name || 'Unnamed Contact'}
          </Text>
          <Text style={[styles.contactNumber, !number && styles.noNumber]} numberOfLines={1}>
            {number || 'No Number'}
          </Text>
        </View>

        {number && (
          <TouchableOpacity style={styles.copyBtn} onPress={() => handleCopyNumber(item)}>
            <Text style={styles.copyBtnText}>Copy</Text>
          </TouchableOpacity>
        )}
      </View>
    );
  };

  const renderEmpty = () => {
    if (loading) return null;
    if (!hasFetched) {
      return (
        <View style={styles.emptyState}>
          <Text style={styles.emptyIcon}>👥</Text>
          <Text style={styles.emptyTitle}>No Contacts Loaded</Text>
          <Text style={styles.emptyText}>
            Tap the button below to request permission and load your contacts.
          </Text>
          <TouchableOpacity style={styles.loadBtn} onPress={() => loadContacts(false)}>
            <Text style={styles.loadBtnText}>Load Contacts</Text>
          </TouchableOpacity>
        </View>
      );
    }
    if (query) {
      return (
        <View style={styles.emptyState}>
          <Text style={styles.emptyIcon}>🔍</Text>
          <Text style={styles.emptyTitle}>No Results Found</Text>
          <Text style={styles.emptyText}>
            No contacts match &quot;{search.trim()}&quot;. Try a different name or number.
          </Text>
        </View>
      );
    }
    return (
      <View style={styles.emptyState}>
        <Text style={styles.emptyIcon}>📇</Text>
        <Text style={styles.emptyTitle}>No Contacts Found</Text>
        <Text style={styles.emptyText}>
          Your device has no contacts. Pull down to refresh after adding some.
        </Text>
      </View>
    );
  };

  return (
    <SafeAreaView style={styles.container}>
      {hasFetched && (
        <View style={styles.toolbar}>
          <TextInput
            style={styles.searchInput}
            placeholder="Search by name or number"
            value={search}
            onChangeText={setSearch}
            placeholderTextColor="#999"
            autoCorrect={false}
          />
          <View style={styles.counterBadge}>
            <Text style={styles.counterText}>
              {query
                ? `${filteredContacts.length} of ${contacts.length}`
                : `${contacts.length} contact${contacts.length === 1 ? '' : 's'}`}
            </Text>
          </View>
        </View>
      )}

      {loading ? (
        <View style={styles.loadingState}>
          <ActivityIndicator size="large" color="#007bff" />
          <Text style={styles.loadingText}>Loading Contacts...</Text>
        </View>
      ) : (
        <FlatList
          data={filteredContacts}
          keyExtractor={(item, index) => item.id ?? `contact-${index}`}
          renderItem={renderContact}
          ListEmptyComponent={renderEmpty}
          contentContainerStyle={
            filteredContacts.length === 0 ? styles.listEmptyContent : styles.listContent
          }
          refreshControl={
            hasFetched ? (
              <RefreshControl
                refreshing={refreshing}
                onRefresh={onRefresh}
                colors={['#007bff']}
                tintColor="#007bff"
              />
            ) : undefined
          }
          keyboardShouldPersistTaps="handled"
        />
      )}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  toolbar: {
    padding: 12,
    borderBottomWidth: 1,
    borderColor: '#eee',
  },
  searchInput: {
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 6,
    padding: 10,
    fontSize: 14,
    color: '#333',
    backgroundColor: '#fafafa',
    marginBottom: 8,
  },
  counterBadge: {
    alignSelf: 'flex-start',
    backgroundColor: '#e7f1ff',
    paddingVertical: 4,
    paddingHorizontal: 10,
    borderRadius: 12,
  },
  counterText: {
    fontSize: 12,
    color: '#007bff',
    fontWeight: '600',
  },
  loadingState: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingText: {
    marginTop: 12,
    fontSize: 14,
    color: '#666',
  },
  listContent: {
    padding: 12,
  },
  listEmptyContent: {
    flexGrow: 1,
    justifyContent: 'center',
    padding: 16,
  },
  contactItem: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 12,
    borderWidth: 1,
    borderColor: '#eee',
    borderRadius: 6,
    marginBottom: 8,
    backgroundColor: '#fff',
  },
  avatar: {
    width: 44,
    height: 44,
    borderRadius: 22,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  avatarText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
  contactInfo: {
    flex: 1,
    marginRight: 8,
  },
  contactName: {
    fontSize: 15,
    fontWeight: '600',
    color: '#333',
    marginBottom: 2,
  },
  contactNumber: {
    fontSize: 13,
    color: '#666',
  },
  noNumber: {
    color: '#dc3545',
    fontStyle: 'italic',
  },
  copyBtn: {
    borderWidth: 1,
    borderColor: '#007bff',
    borderRadius: 6,
    paddingVertical: 6,
    paddingHorizontal: 14,
  },
  copyBtnText: {
    color: '#007bff',
    fontSize: 13,
    fontWeight: '600',
  },
  emptyState: {
    alignItems: 'center',
    padding: 24,
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
  loadBtn: {
    backgroundColor: '#007bff',
    paddingVertical: 14,
    paddingHorizontal: 32,
    borderRadius: 6,
    alignItems: 'center',
  },
  loadBtnText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
});
