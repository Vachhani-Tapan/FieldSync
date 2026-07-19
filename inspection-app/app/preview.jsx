import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  TextInput,
  Alert,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useSurveys } from '@/context/SurveyContext';

const PRIORITY_OPTIONS = ['Low', 'Medium', 'High', 'Critical'];

export default function PreviewScreen() {
  const { surveys, updateSurvey, submitSurvey } = useSurveys();
  const [selectedId, setSelectedId] = useState(null);
  const [editing, setEditing] = useState(false);
  const [form, setForm] = useState({});

  const survey = surveys.find((s) => s.id === selectedId);

  const startEdit = () => {
    setForm({
      siteName: survey.siteName,
      clientName: survey.clientName,
      description: survey.description,
      priority: survey.priority,
      date: survey.date,
      location: survey.location,
      contact: survey.contact || '',
      photo: survey.photo || '',
      notes: survey.notes || '',
    });
    setEditing(true);
  };

  const cancelEdit = () => {
    setEditing(false);
    setForm({});
  };

  const handleSave = () => {
    if (!form.siteName?.trim() || !form.clientName?.trim()) {
      Alert.alert('Error', 'Site Name and Client Name are required.');
      return;
    }
    updateSurvey(selectedId, {
      ...form,
      siteName: form.siteName.trim(),
      clientName: form.clientName.trim(),
    });
    setEditing(false);
    Alert.alert('Saved', 'Survey updated successfully.');
  };

  const handleSubmit = () => {
    Alert.alert(
      'Submit Survey',
      `Submit survey ${selectedId} as completed?`,
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Submit',
          onPress: () => {
            submitSurvey(selectedId);
            Alert.alert('Submitted', `${selectedId} marked as Completed.`);
          },
        },
      ]
    );
  };

  const getStatusStyle = (status) => {
    switch (status) {
      case 'Completed': return { bg: '#d4edda', text: '#155724' };
      case 'Pending': return { bg: '#fff3cd', text: '#856404' };
      case 'Flagged': return { bg: '#f8d7da', text: '#721c24' };
      case 'In Progress': return { bg: '#cce5ff', text: '#004085' };
      default: return { bg: '#e2e3e5', text: '#383d41' };
    }
  };

  const renderDetail = (label, value) => (
    <View style={styles.detailRow}>
      <Text style={styles.detailLabel}>{label}</Text>
      <Text style={styles.detailValue}>{value || '—'}</Text>
    </View>
  );

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollContent}>
        <View style={styles.logoContainer}>
          <View style={styles.logoIcon}>
            <Text style={styles.logoEmoji}>🔍</Text>
          </View>
          <Text style={styles.logoTitle}>Survey Preview</Text>
          <Text style={styles.logoSubtitle}>Module 7</Text>
        </View>

        <View style={styles.card}>
          <Text style={styles.cardTitle}>Survey Overview</Text>
          <Text style={styles.cardDescription}>
            Select a survey to preview, edit, or submit.
          </Text>
        </View>

        {!selectedId ? (
          <View>
            <Text style={styles.sectionHeader}>All Surveys</Text>
            {surveys.length === 0 ? (
              <View style={styles.emptyState}>
                <Text style={styles.emptyText}>No surveys found. Create one from the Survey tab.</Text>
              </View>
            ) : (
              surveys.map((s) => {
                const st = getStatusStyle(s.status);
                return (
                  <TouchableOpacity
                    key={s.id}
                    style={styles.surveyCard}
                    onPress={() => setSelectedId(s.id)}
                  >
                    <View style={styles.surveyCardHeader}>
                      <Text style={styles.surveyId}>{s.id}</Text>
                      <View style={[styles.badge, { backgroundColor: st.bg }]}>
                        <Text style={[styles.badgeText, { color: st.text }]}>{s.status}</Text>
                      </View>
                    </View>
                    <Text style={styles.surveySite}>{s.siteName}</Text>
                    <Text style={styles.surveyClient}>{s.clientName}</Text>
                    <Text style={styles.surveyDate}>{s.date}</Text>
                  </TouchableOpacity>
                );
              })
            )}
          </View>
        ) : editing ? (
          <View>
            <View style={styles.editHeader}>
              <Text style={styles.sectionHeader}>Edit {selectedId}</Text>
            </View>
            <Text style={styles.fieldLabel}>Site Name</Text>
            <TextInput
              style={styles.input}
              value={form.siteName}
              onChangeText={(v) => setForm({ ...form, siteName: v })}
            />
            <Text style={styles.fieldLabel}>Client Name</Text>
            <TextInput
              style={styles.input}
              value={form.clientName}
              onChangeText={(v) => setForm({ ...form, clientName: v })}
            />
            <Text style={styles.fieldLabel}>Location</Text>
            <TextInput
              style={styles.input}
              value={form.location}
              onChangeText={(v) => setForm({ ...form, location: v })}
            />
            <Text style={styles.fieldLabel}>Date</Text>
            <TextInput
              style={styles.input}
              value={form.date}
              onChangeText={(v) => setForm({ ...form, date: v })}
            />
            <Text style={styles.fieldLabel}>Priority</Text>
            <View style={styles.priorityRow}>
              {PRIORITY_OPTIONS.map((p) => (
                <TouchableOpacity
                  key={p}
                  style={[
                    styles.priorityBtn,
                    form.priority === p && styles.priorityBtnActive,
                  ]}
                  onPress={() => setForm({ ...form, priority: p })}
                >
                  <Text
                    style={[
                      styles.priorityBtnText,
                      form.priority === p && styles.priorityBtnTextActive,
                    ]}
                  >
                    {p}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>
            <Text style={styles.fieldLabel}>Contact</Text>
            <TextInput
              style={styles.input}
              value={form.contact}
              onChangeText={(v) => setForm({ ...form, contact: v })}
              placeholder="Contact info"
            />
            <Text style={styles.fieldLabel}>Photo URL</Text>
            <TextInput
              style={styles.input}
              value={form.photo}
              onChangeText={(v) => setForm({ ...form, photo: v })}
              placeholder="Photo reference"
            />
            <Text style={styles.fieldLabel}>Notes / Description</Text>
            <TextInput
              style={[styles.input, styles.multiline]}
              multiline
              value={form.description}
              onChangeText={(v) => setForm({ ...form, description: v })}
            />
            <View style={styles.editActions}>
              <TouchableOpacity style={styles.saveBtn} onPress={handleSave}>
                <Text style={styles.saveBtnText}>Save Changes</Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.cancelBtn} onPress={cancelEdit}>
                <Text style={styles.cancelBtnText}>Cancel</Text>
              </TouchableOpacity>
            </View>
          </View>
        ) : (
          <View>
            <TouchableOpacity
              style={styles.backBtn}
              onPress={() => setSelectedId(null)}
            >
              <Text style={styles.backBtnText}>← Back to list</Text>
            </TouchableOpacity>

            <View style={styles.detailCard}>
              <View style={styles.detailTitleRow}>
                <Text style={styles.detailTitle}>{survey.id}</Text>
                <View
                  style={[
                    styles.badge,
                    { backgroundColor: getStatusStyle(survey.status).bg },
                  ]}
                >
                  <Text
                    style={[
                      styles.badgeText,
                      { color: getStatusStyle(survey.status).text },
                    ]}
                  >
                    {survey.status}
                  </Text>
                </View>
              </View>
            </View>

            <Text style={styles.sectionHeader}>Site Details</Text>
            <View style={styles.detailBox}>
              {renderDetail('Site Name', survey.siteName)}
              {renderDetail('Location', survey.location)}
              {renderDetail('Date', survey.date)}
              {renderDetail('Priority', survey.priority)}
            </View>

            <Text style={styles.sectionHeader}>Client</Text>
            <View style={styles.detailBox}>
              {renderDetail('Client Name', survey.clientName)}
              {renderDetail('Contact', survey.contact)}
            </View>

            <Text style={styles.sectionHeader}>Photo</Text>
            <View style={styles.detailBox}>
              {survey.photo ? (
                <Text style={styles.detailValue}>{survey.photo}</Text>
              ) : (
                <View style={styles.placeholderBox}>
                  <Text style={styles.placeholderText}>No photo attached</Text>
                </View>
              )}
            </View>

            <Text style={styles.sectionHeader}>Notes</Text>
            <View style={styles.detailBox}>
              <Text style={styles.detailValueFull}>{survey.description || survey.notes || 'No notes'}</Text>
            </View>

            <View style={styles.previewActions}>
              <TouchableOpacity
                style={[styles.actionBtn, styles.editActionBtn]}
                onPress={startEdit}
              >
                <Text style={styles.editActionText}>Edit Survey</Text>
              </TouchableOpacity>
              {survey.status !== 'Completed' && (
                <TouchableOpacity
                  style={[styles.actionBtn, styles.submitActionBtn]}
                  onPress={handleSubmit}
                >
                  <Text style={styles.submitActionText}>Submit Survey</Text>
                </TouchableOpacity>
              )}
            </View>
          </View>
        )}
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#fff' },
  scrollContent: { padding: 16 },
  logoContainer: { alignItems: 'center', marginBottom: 20, marginTop: 8 },
  logoIcon: {
    width: 64, height: 64, borderRadius: 32, backgroundColor: '#fff3e0',
    justifyContent: 'center', alignItems: 'center', marginBottom: 12,
  },
  logoEmoji: { fontSize: 30 },
  logoTitle: { fontSize: 20, fontWeight: 'bold', color: '#333' },
  logoSubtitle: { fontSize: 13, color: '#007bff', fontWeight: '600', marginTop: 2 },
  card: {
    padding: 14, borderWidth: 1, borderColor: '#ccc',
    borderRadius: 6, marginBottom: 16,
  },
  cardTitle: { fontSize: 16, fontWeight: 'bold', marginBottom: 4 },
  cardDescription: { fontSize: 13, color: '#666' },
  sectionHeader: {
    fontSize: 15, fontWeight: 'bold', marginTop: 8, marginBottom: 10, color: '#333',
  },
  emptyState: { padding: 24, alignItems: 'center' },
  emptyText: { fontSize: 14, color: '#999', textAlign: 'center' },
  surveyCard: {
    padding: 14, borderWidth: 1, borderColor: '#ddd', borderRadius: 6,
    marginBottom: 8, backgroundColor: '#fafafa',
  },
  surveyCardHeader: {
    flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 6,
  },
  surveyId: { fontSize: 13, fontWeight: 'bold', color: '#007bff' },
  badge: { paddingVertical: 2, paddingHorizontal: 8, borderRadius: 4 },
  badgeText: { fontSize: 11, fontWeight: 'bold' },
  surveySite: { fontSize: 15, fontWeight: '600', color: '#333' },
  surveyClient: { fontSize: 13, color: '#666', marginTop: 2 },
  surveyDate: { fontSize: 12, color: '#999', marginTop: 2 },
  backBtn: { marginBottom: 12 },
  backBtnText: { color: '#007bff', fontSize: 14, fontWeight: '600' },
  detailCard: {
    padding: 14, borderWidth: 1, borderColor: '#ccc', borderRadius: 6, marginBottom: 12,
  },
  detailTitleRow: {
    flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center',
  },
  detailTitle: { fontSize: 16, fontWeight: 'bold', color: '#007bff' },
  detailBox: {
    borderWidth: 1, borderColor: '#eee', borderRadius: 6, marginBottom: 12, overflow: 'hidden',
  },
  detailRow: {
    flexDirection: 'row', padding: 12, borderBottomWidth: 1, borderColor: '#f0f0f0',
  },
  detailLabel: { width: 100, fontSize: 13, color: '#999', fontWeight: '600' },
  detailValue: { flex: 1, fontSize: 13, color: '#333' },
  detailValueFull: { padding: 12, fontSize: 13, color: '#333', lineHeight: 20 },
  placeholderBox: {
    padding: 20, alignItems: 'center', backgroundColor: '#fafafa',
  },
  placeholderText: { fontSize: 13, color: '#ccc' },
  input: {
    borderWidth: 1, borderColor: '#ccc', borderRadius: 6, padding: 12,
    fontSize: 14, marginBottom: 12,
  },
  multiline: { minHeight: 80, textAlignVertical: 'top' },
  fieldLabel: { fontSize: 13, fontWeight: '600', color: '#555', marginBottom: 4 },
  priorityRow: { flexDirection: 'row', marginBottom: 12, gap: 6 },
  priorityBtn: {
    flex: 1, padding: 10, borderWidth: 1, borderColor: '#ddd',
    borderRadius: 6, alignItems: 'center',
  },
  priorityBtnActive: { backgroundColor: '#007bff', borderColor: '#007bff' },
  priorityBtnText: { fontSize: 12, fontWeight: '600', color: '#333' },
  priorityBtnTextActive: { color: '#fff' },
  editHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  editActions: { marginTop: 8, gap: 8 },
  saveBtn: {
    backgroundColor: '#007bff', padding: 14, borderRadius: 6, alignItems: 'center',
  },
  saveBtnText: { color: '#fff', fontSize: 15, fontWeight: 'bold' },
  cancelBtn: {
    padding: 14, borderRadius: 6, alignItems: 'center',
    borderWidth: 1, borderColor: '#999',
  },
  cancelBtnText: { color: '#666', fontSize: 14, fontWeight: '600' },
  previewActions: { marginTop: 8, gap: 8 },
  actionBtn: { padding: 14, borderRadius: 6, alignItems: 'center' },
  editActionBtn: { backgroundColor: '#007bff' },
  editActionText: { color: '#fff', fontSize: 15, fontWeight: 'bold' },
  submitActionBtn: { backgroundColor: '#28a745' },
  submitActionText: { color: '#fff', fontSize: 15, fontWeight: 'bold' },
});
