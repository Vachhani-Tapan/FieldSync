import React, { useState, useMemo } from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  TextInput,
  Alert,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useSurveys } from '@/context/SurveyContext';

const PRIORITIES = ['All', 'Low', 'Medium', 'High', 'Critical'];

export default function HistoryScreen() {
  const { surveys, deleteSurvey } = useSurveys();
  const [search, setSearch] = useState('');
  const [filter, setFilter] = useState('All');
  const [selectedId, setSelectedId] = useState(null);

  const filtered = useMemo(() => {
    return surveys.filter((s) => {
      const matchSearch =
        !search.trim() ||
        s.id.toLowerCase().includes(search.toLowerCase()) ||
        s.siteName.toLowerCase().includes(search.toLowerCase()) ||
        s.clientName.toLowerCase().includes(search.toLowerCase());
      const matchPriority = filter === 'All' || s.priority === filter;
      return matchSearch && matchPriority;
    });
  }, [surveys, search, filter]);

  const handleDelete = (id, siteName) => {
    Alert.alert(
      'Delete Survey',
      `Are you sure you want to delete ${id} (${siteName})?`,
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Delete',
          style: 'destructive',
          onPress: () => {
            deleteSurvey(id);
            if (selectedId === id) setSelectedId(null);
            Alert.alert('Deleted', `${id} has been removed.`);
          },
        },
      ]
    );
  };

  const survey = selectedId ? surveys.find((s) => s.id === selectedId) : null;

  const getStatusStyle = (status) => {
    switch (status) {
      case 'Completed': return { bg: '#d4edda', text: '#155724' };
      case 'Pending': return { bg: '#fff3cd', text: '#856404' };
      case 'Flagged': return { bg: '#f8d7da', text: '#721c24' };
      case 'In Progress': return { bg: '#cce5ff', text: '#004085' };
      default: return { bg: '#e2e3e5', text: '#383d41' };
    }
  };

  const getPriorityColor = (p) => {
    switch (p) {
      case 'Critical': return '#dc3545';
      case 'High': return '#fd7e14';
      case 'Medium': return '#ffc107';
      case 'Low': return '#28a745';
      default: return '#999';
    }
  };

  if (selectedId && survey) {
    const st = getStatusStyle(survey.status);
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.detailContainer}>
          <TouchableOpacity style={styles.backBtn} onPress={() => setSelectedId(null)}>
            <Text style={styles.backBtnText}>← Back to list</Text>
          </TouchableOpacity>

          <View style={styles.detailCard}>
            <View style={styles.detailTitleRow}>
              <Text style={styles.detailTitle}>{survey.id}</Text>
              <View style={[styles.badge, { backgroundColor: st.bg }]}>
                <Text style={[styles.badgeText, { color: st.text }]}>{survey.status}</Text>
              </View>
            </View>
          </View>

          <View style={styles.detailBox}>
            <View style={styles.detailRow}>
              <Text style={styles.detailLabel}>Site</Text>
              <Text style={styles.detailValue}>{survey.siteName}</Text>
            </View>
            <View style={styles.detailRow}>
              <Text style={styles.detailLabel}>Client</Text>
              <Text style={styles.detailValue}>{survey.clientName}</Text>
            </View>
            <View style={styles.detailRow}>
              <Text style={styles.detailLabel}>Location</Text>
              <Text style={styles.detailValue}>{survey.location || '—'}</Text>
            </View>
            <View style={styles.detailRow}>
              <Text style={styles.detailLabel}>Date</Text>
              <Text style={styles.detailValue}>{survey.date}</Text>
            </View>
            <View style={styles.detailRow}>
              <Text style={styles.detailLabel}>Priority</Text>
              <View style={{ flexDirection: 'row', alignItems: 'center', gap: 6 }}>
                <View style={[styles.priorityDot, { backgroundColor: getPriorityColor(survey.priority) }]} />
                <Text style={styles.detailValue}>{survey.priority}</Text>
              </View>
            </View>
            <View style={styles.detailRowLast}>
              <Text style={styles.detailLabel}>Description</Text>
              <Text style={styles.detailValue}>{survey.description || '—'}</Text>
            </View>
          </View>

          <TouchableOpacity
            style={styles.deleteBtn}
            onPress={() => handleDelete(survey.id, survey.siteName)}
          >
            <Text style={styles.deleteBtnText}>Delete Survey</Text>
          </TouchableOpacity>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.logoContainer}>
        <View style={styles.logoIcon}>
          <Text style={styles.logoEmoji}>📜</Text>
        </View>
        <Text style={styles.logoTitle}>Survey History</Text>
        <Text style={styles.logoSubtitle}>Module 8</Text>
      </View>

      <View style={styles.toolbar}>
        <View style={styles.searchRow}>
          <TextInput
            style={styles.searchInput}
            placeholder="Search by ID, site, or client..."
            placeholderTextColor="#999"
            value={search}
            onChangeText={setSearch}
          />
          {search ? (
            <TouchableOpacity onPress={() => setSearch('')}>
              <Text style={styles.clearSearch}>✕</Text>
            </TouchableOpacity>
          ) : null}
        </View>
        <View style={styles.filterRow}>
          {PRIORITIES.map((p) => (
            <TouchableOpacity
              key={p}
              style={[styles.filterBtn, filter === p && styles.filterBtnActive]}
              onPress={() => setFilter(p)}
            >
              <Text style={[styles.filterBtnText, filter === p && styles.filterBtnTextActive]}>
                {p}
              </Text>
            </TouchableOpacity>
          ))}
        </View>
      </View>

      {filtered.length === 0 ? (
        <View style={styles.emptyState}>
          <Text style={styles.emptyText}>No surveys match your criteria.</Text>
        </View>
      ) : (
        <FlatList
          data={filtered}
          keyExtractor={(item) => item.id}
          contentContainerStyle={styles.list}
          renderItem={({ item }) => {
            const st = getStatusStyle(item.status);
            return (
              <TouchableOpacity
                style={styles.surveyCard}
                onPress={() => setSelectedId(item.id)}
                onLongPress={() => handleDelete(item.id, item.siteName)}
              >
                <View style={styles.surveyHeader}>
                  <Text style={styles.surveyId}>{item.id}</Text>
                  <View style={[styles.badge, { backgroundColor: st.bg }]}>
                    <Text style={[styles.badgeText, { color: st.text }]}>{item.status}</Text>
                  </View>
                </View>
                <Text style={styles.surveySite}>{item.siteName}</Text>
                <Text style={styles.surveyClient}>{item.clientName}</Text>
                <View style={styles.surveyFooter}>
                  <Text style={styles.surveyDate}>{item.date}</Text>
                  <View style={{ flexDirection: 'row', alignItems: 'center', gap: 4 }}>
                    <View style={[styles.priorityDot, { backgroundColor: getPriorityColor(item.priority) }]} />
                    <Text style={styles.surveyPriority}>{item.priority}</Text>
                  </View>
                </View>
              </TouchableOpacity>
            );
          }}
        />
      )}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#fff' },
  logoContainer: { alignItems: 'center', marginTop: 12, marginBottom: 12 },
  logoIcon: {
    width: 64, height: 64, borderRadius: 32, backgroundColor: '#f0f4ff',
    justifyContent: 'center', alignItems: 'center', marginBottom: 8,
  },
  logoEmoji: { fontSize: 30 },
  logoTitle: { fontSize: 20, fontWeight: 'bold', color: '#333' },
  logoSubtitle: { fontSize: 13, color: '#007bff', fontWeight: '600', marginTop: 2 },
  toolbar: { paddingHorizontal: 16, marginBottom: 8 },
  searchRow: {
    flexDirection: 'row', alignItems: 'center', borderWidth: 1, borderColor: '#ccc',
    borderRadius: 6, paddingHorizontal: 12, marginBottom: 8,
  },
  searchInput: { flex: 1, paddingVertical: 10, fontSize: 14 },
  clearSearch: { fontSize: 16, color: '#999', paddingLeft: 8 },
  filterRow: { flexDirection: 'row', gap: 6 },
  filterBtn: {
    paddingVertical: 6, paddingHorizontal: 12, borderRadius: 16,
    borderWidth: 1, borderColor: '#ddd',
  },
  filterBtnActive: { backgroundColor: '#007bff', borderColor: '#007bff' },
  filterBtnText: { fontSize: 12, color: '#666', fontWeight: '600' },
  filterBtnTextActive: { color: '#fff' },
  list: { paddingHorizontal: 16, paddingBottom: 32 },
  emptyState: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  emptyText: { fontSize: 14, color: '#999' },
  surveyCard: {
    padding: 14, borderWidth: 1, borderColor: '#ddd', borderRadius: 6,
    marginBottom: 8, backgroundColor: '#fafafa',
  },
  surveyHeader: {
    flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 6,
  },
  surveyId: { fontSize: 13, fontWeight: 'bold', color: '#007bff' },
  badge: { paddingVertical: 2, paddingHorizontal: 8, borderRadius: 4 },
  badgeText: { fontSize: 11, fontWeight: 'bold' },
  surveySite: { fontSize: 15, fontWeight: '600', color: '#333' },
  surveyClient: { fontSize: 13, color: '#666', marginTop: 2 },
  surveyFooter: {
    flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginTop: 6,
  },
  surveyDate: { fontSize: 12, color: '#999' },
  surveyPriority: { fontSize: 12, color: '#666', fontWeight: '500' },
  priorityDot: { width: 8, height: 8, borderRadius: 4 },
  backBtn: { marginBottom: 12 },
  backBtnText: { color: '#007bff', fontSize: 14, fontWeight: '600' },
  detailContainer: { flex: 1, padding: 16 },
  detailCard: {
    padding: 14, borderWidth: 1, borderColor: '#ccc', borderRadius: 6, marginBottom: 12,
  },
  detailTitleRow: {
    flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center',
  },
  detailTitle: { fontSize: 16, fontWeight: 'bold', color: '#007bff' },
  detailBox: {
    borderWidth: 1, borderColor: '#eee', borderRadius: 6, marginBottom: 16, overflow: 'hidden',
  },
  detailRow: {
    flexDirection: 'row', padding: 12, borderBottomWidth: 1, borderColor: '#f0f0f0',
  },
  detailRowLast: {
    flexDirection: 'row', padding: 12,
  },
  detailLabel: { width: 80, fontSize: 13, color: '#999', fontWeight: '600' },
  detailValue: { flex: 1, fontSize: 13, color: '#333' },
  deleteBtn: {
    backgroundColor: '#dc3545', padding: 14, borderRadius: 6, alignItems: 'center',
  },
  deleteBtnText: { color: '#fff', fontSize: 15, fontWeight: 'bold' },
});
