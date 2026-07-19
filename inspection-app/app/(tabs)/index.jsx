import React from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { useSurveys } from '@/context/SurveyContext';

const PRIORITY_COLORS = { Low: '#28a745', Medium: '#ffc107', High: '#fd7e14', Critical: '#dc3545' };
const STATUS_COLORS = { Completed: '#28a745', Pending: '#ffc107', 'In Progress': '#007bff', Flagged: '#dc3545' };

export default function Module1Screen() {
  const router = useRouter();
  const { surveys, stats } = useSurveys();

  const priorityCounts = { Low: 0, Medium: 0, High: 0, Critical: 0 };
  surveys.forEach((s) => { if (priorityCounts[s.priority] !== undefined) priorityCounts[s.priority]++; });

  const locations = [...new Set(surveys.map((s) => s.location).filter(Boolean))];
  const completionRate = stats.total > 0 ? Math.round((stats.completed / stats.total) * 100) : 0;

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollContent}>
        <View style={styles.greetingCard}>
          <View>
            <Text style={styles.greetingTitle}>FieldSync</Text>
            <Text style={styles.greetingSub}>Inspection Dashboard</Text>
          </View>
          <View style={styles.greetingBadge}>
            <Text style={styles.greetingBadgeText}>{stats.total} Surveys</Text>
          </View>
        </View>

        <Text style={styles.sectionTitle}>Overview</Text>
        <View style={styles.statsGrid}>
          <View style={[styles.statCard, { backgroundColor: '#eef6ff' }]}>
            <Text style={[styles.statValue, { color: '#007bff' }]}>{stats.total}</Text>
            <Text style={styles.statName}>Total</Text>
          </View>
          <View style={[styles.statCard, { backgroundColor: '#e8f5e9' }]}>
            <Text style={[styles.statValue, { color: '#28a745' }]}>{stats.completed}</Text>
            <Text style={styles.statName}>Completed</Text>
          </View>
          <View style={[styles.statCard, { backgroundColor: '#fff8e1' }]}>
            <Text style={[styles.statValue, { color: '#f39c12' }]}>{stats.pending}</Text>
            <Text style={styles.statName}>Pending</Text>
          </View>
          <View style={[styles.statCard, { backgroundColor: '#fbe9e7' }]}>
            <Text style={[styles.statValue, { color: '#e74c3c' }]}>{stats.flagged}</Text>
            <Text style={styles.statName}>Flagged</Text>
          </View>
        </View>

        <View style={styles.insightCard}>
          <Text style={styles.insightTitle}>Completion Rate</Text>
          <View style={styles.insightRow}>
            <View style={styles.insightBarBg}>
              <View style={[styles.insightBarFill, { width: `${completionRate}%` }]} />
            </View>
            <Text style={styles.insightPct}>{completionRate}%</Text>
          </View>
          <Text style={styles.insightSub}>{stats.completed} of {stats.total} surveys completed</Text>
        </View>

        <Text style={styles.sectionTitle}>Priority Distribution</Text>
        <View style={styles.priorityCard}>
          {Object.entries(priorityCounts).map(([level, count]) => (
            <View key={level} style={styles.priorityRow}>
              <View style={styles.priorityLeft}>
                <View style={[styles.priorityDot, { backgroundColor: PRIORITY_COLORS[level] }]} />
                <Text style={styles.priorityLabel}>{level}</Text>
              </View>
              <View style={styles.priorityBarBg}>
                <View
                  style={[
                    styles.priorityBarFill,
                    { width: `${stats.total > 0 ? (count / stats.total) * 100 : 0}%`, backgroundColor: PRIORITY_COLORS[level] },
                  ]}
                />
              </View>
              <Text style={styles.priorityCount}>{count}</Text>
            </View>
          ))}
        </View>

        {locations.length > 0 && (
          <View>
            <Text style={styles.sectionTitle}>Active Locations</Text>
            <View style={styles.locationWrap}>
              {locations.slice(0, 6).map((loc) => (
                <View key={loc} style={styles.locationChip}>
                  <Text style={styles.locationChipText}>{loc}</Text>
                </View>
              ))}
            </View>
          </View>
        )}

        <Text style={styles.sectionTitle}>Quick Actions</Text>
        <View style={styles.actionsGrid}>
          <TouchableOpacity style={styles.actionCard} onPress={() => router.navigate('/(tabs)/module2')}>
            <Text style={styles.actionIcon}>+</Text>
            <Text style={styles.actionLabel}>New Survey</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.actionCard} onPress={() => router.navigate('/(tabs)/module3')}>
            <Text style={styles.actionIcon}>📷</Text>
            <Text style={styles.actionLabel}>Camera</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.actionCard} onPress={() => router.navigate('/location')}>
            <Text style={styles.actionIcon}>📍</Text>
            <Text style={styles.actionLabel}>Location</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.actionCard} onPress={() => router.navigate('/(tabs)/module5')}>
            <Text style={styles.actionIcon}>👥</Text>
            <Text style={styles.actionLabel}>Contacts</Text>
          </TouchableOpacity>
        </View>

        {surveys.length > 0 && (
          <View>
            <Text style={styles.sectionTitle}>Recent Surveys</Text>
            {surveys.slice(0, 5).map((item) => (
              <View key={item.id} style={[styles.surveyCard, item.status === 'Flagged' && styles.surveyCardFlagged]}>
                <View style={styles.surveyTop}>
                  <Text style={styles.surveyId}>{item.id}</Text>
                  <View style={[styles.surveyStatus, { backgroundColor: STATUS_COLORS[item.status] || '#999' }]}>
                    <Text style={styles.surveyStatusText}>{item.status}</Text>
                  </View>
                </View>
                <Text style={styles.surveySite}>{item.siteName}</Text>
                <View style={styles.surveyMeta}>
                  <Text style={styles.surveyMetaText}>Client: {item.clientName}</Text>
                  <Text style={styles.surveyMetaText}>Priority: {item.priority}</Text>
                </View>
                <Text style={styles.surveyDate}>{item.date}</Text>
              </View>
            ))}
          </View>
        )}
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#f5f6fa' },
  scrollContent: { padding: 16, paddingBottom: 4 },

  greetingCard: {
    flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center',
    backgroundColor: '#fff', padding: 16, borderRadius: 12, marginBottom: 16,
    shadowColor: '#000', shadowOffset: { width: 0, height: 1 }, shadowOpacity: 0.05, shadowRadius: 4, elevation: 2,
  },
  greetingTitle: { fontSize: 20, fontWeight: 'bold', color: '#1a1a2e' },
  greetingSub: { fontSize: 13, color: '#888', marginTop: 2 },
  greetingBadge: { backgroundColor: '#eef6ff', paddingVertical: 4, paddingHorizontal: 12, borderRadius: 12 },
  greetingBadgeText: { fontSize: 12, fontWeight: '600', color: '#007bff' },

  sectionTitle: {
    fontSize: 15, fontWeight: '700', color: '#1a1a2e', marginBottom: 10, marginTop: 4,
  },

  statsGrid: { flexDirection: 'row', gap: 8, marginBottom: 14 },
  statCard: {
    flex: 1, padding: 12, borderRadius: 10, alignItems: 'center',
  },
  statValue: { fontSize: 20, fontWeight: 'bold' },
  statName: { fontSize: 11, color: '#666', marginTop: 2, fontWeight: '500' },

  insightCard: {
    backgroundColor: '#fff', padding: 16, borderRadius: 12, marginBottom: 14,
    shadowColor: '#000', shadowOffset: { width: 0, height: 1 }, shadowOpacity: 0.05, shadowRadius: 4, elevation: 2,
  },
  insightTitle: { fontSize: 14, fontWeight: '600', color: '#333', marginBottom: 10 },
  insightRow: { flexDirection: 'row', alignItems: 'center', gap: 10 },
  insightBarBg: {
    flex: 1, height: 10, backgroundColor: '#e9ecef', borderRadius: 5, overflow: 'hidden',
  },
  insightBarFill: { height: 10, backgroundColor: '#007bff', borderRadius: 5 },
  insightPct: { fontSize: 16, fontWeight: 'bold', color: '#007bff', width: 44, textAlign: 'right' },
  insightSub: { fontSize: 12, color: '#999', marginTop: 6 },

  priorityCard: {
    backgroundColor: '#fff', padding: 14, borderRadius: 12, marginBottom: 14,
    shadowColor: '#000', shadowOffset: { width: 0, height: 1 }, shadowOpacity: 0.05, shadowRadius: 4, elevation: 2,
  },
  priorityRow: { flexDirection: 'row', alignItems: 'center', marginBottom: 6 },
  priorityLeft: { flexDirection: 'row', alignItems: 'center', width: 72 },
  priorityDot: { width: 8, height: 8, borderRadius: 4, marginRight: 6 },
  priorityLabel: { fontSize: 12, color: '#555', fontWeight: '500' },
  priorityBarBg: {
    flex: 1, height: 6, backgroundColor: '#f0f0f0', borderRadius: 3, marginHorizontal: 8,
  },
  priorityBarFill: { height: 6, borderRadius: 3 },
  priorityCount: { fontSize: 13, fontWeight: 'bold', color: '#333', width: 20, textAlign: 'right' },

  locationWrap: { flexDirection: 'row', flexWrap: 'wrap', gap: 6, marginBottom: 14 },
  locationChip: {
    backgroundColor: '#eef6ff', paddingVertical: 6, paddingHorizontal: 12, borderRadius: 16,
  },
  locationChipText: { fontSize: 12, color: '#007bff', fontWeight: '500' },

  actionsGrid: { flexDirection: 'row', gap: 8, marginBottom: 14 },
  actionCard: {
    flex: 1, backgroundColor: '#fff', padding: 14, borderRadius: 12, alignItems: 'center',
    shadowColor: '#000', shadowOffset: { width: 0, height: 1 }, shadowOpacity: 0.05, shadowRadius: 4, elevation: 2,
  },
  actionIcon: { fontSize: 22, marginBottom: 6 },
  actionLabel: { fontSize: 11, color: '#555', fontWeight: '600' },

  surveyCard: {
    backgroundColor: '#fff', padding: 14, borderRadius: 12, marginBottom: 8,
    shadowColor: '#000', shadowOffset: { width: 0, height: 1 }, shadowOpacity: 0.03, shadowRadius: 3, elevation: 1,
  },
  surveyCardFlagged: { borderLeftWidth: 3, borderLeftColor: '#dc3545' },
  surveyTop: {
    flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 6,
  },
  surveyId: { fontSize: 13, fontWeight: '700', color: '#007bff' },
  surveyStatus: { paddingVertical: 2, paddingHorizontal: 8, borderRadius: 4 },
  surveyStatusText: { fontSize: 10, fontWeight: 'bold', color: '#fff' },
  surveySite: { fontSize: 15, fontWeight: '600', color: '#222', marginBottom: 4 },
  surveyMeta: { flexDirection: 'row', gap: 12, marginBottom: 2 },
  surveyMetaText: { fontSize: 12, color: '#777' },
  surveyDate: { fontSize: 12, color: '#aaa' },
});
