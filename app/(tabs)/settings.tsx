import { useEffect, useState } from 'react';
import { ActivityIndicator, Alert, Pressable, ScrollView, Switch, Text, View } from 'react-native';
import { STRETCHES } from '@/data/stretches';
import { clearCache, getLastSynced } from '@/lib/storage';
import { useStretches } from '@/lib/stretches-store';

export default function SettingsScreen() {
  const { stretches, addStretch, reload } = useStretches();

  const [showSeconds, setShowSeconds] = useState(true);
  const [showDifficulty, setShowDifficulty] = useState(true);
  const [lastSynced, setLastSynced] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);
  const [message, setMessage] = useState<string | null>(null);

  // Read the cache timestamp when the screen mounts and after any change.
  useEffect(() => {
    getLastSynced().then(setLastSynced);
  }, [stretches]);

  // Uploads any of the 12 built-in stretches that aren't on the server yet.
  async function restoreDefaults() {
    setBusy(true);
    setMessage(null);
    try {
      const existingNames = stretches.map((s) => s.name);
      const missing = STRETCHES.filter((s) => !existingNames.includes(s.name));

      for (const item of missing) {
        // Drop the local slug id - MockAPI assigns its own id on create.
        const { id, ...fields } = item;
        await addStretch(fields);
      }

      setMessage(missing.length === 0 ? 'Already up to date.' : `Uploaded ${missing.length} stretches.`);
    } catch {
      setMessage('Could not reach the server. Check your connection and try again.');
    } finally {
      setBusy(false);
    }
  }

  function confirmClearCache() {
    Alert.alert('Clear saved copy?', 'The app will need a connection until it loads from the server again.', [
      { text: 'Cancel', style: 'cancel' },
      {
        text: 'Clear',
        style: 'destructive',
        onPress: async () => {
          await clearCache();
          setLastSynced(null);
          setMessage('Saved copy cleared.');
        },
      },
    ]);
  }

  return (
    <ScrollView style={{ flex: 1, backgroundColor: 'white' }} contentContainerStyle={{ padding: 20, paddingTop: 60 }}>
      <Text style={{ fontSize: 26, fontWeight: 'bold', marginBottom: 20 }}>Settings</Text>

      <Text style={{ fontWeight: '600', marginBottom: 8 }}>Display</Text>
      <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingVertical: 10 }}>
        <Text>Show hold time</Text>
        <Switch value={showSeconds} onValueChange={setShowSeconds} />
      </View>
      <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingVertical: 10 }}>
        <Text>Show difficulty</Text>
        <Switch value={showDifficulty} onValueChange={setShowDifficulty} />
      </View>

      <Text style={{ fontWeight: '600', marginTop: 28, marginBottom: 8 }}>Offline data</Text>
      <Text style={{ color: '#666' }}>
        {lastSynced ? `Last saved: ${new Date(lastSynced).toLocaleString()}` : 'No saved copy on this device.'}
      </Text>

      <Pressable
        onPress={reload}
        style={{ marginTop: 12, paddingVertical: 12, borderRadius: 8, backgroundColor: '#EEE', alignItems: 'center' }}
      >
        <Text style={{ fontWeight: '600', color: '#333' }}>Refresh from server</Text>
      </Pressable>

      <Pressable
        onPress={confirmClearCache}
        style={{ marginTop: 10, paddingVertical: 12, borderRadius: 8, backgroundColor: '#EEE', alignItems: 'center' }}
      >
        <Text style={{ fontWeight: '600', color: '#333' }}>Clear saved copy</Text>
      </Pressable>

      <Text style={{ fontWeight: '600', marginTop: 28, marginBottom: 8 }}>Library</Text>
      <Text style={{ color: '#666' }}>Uploads the 12 built-in stretches to the server if they are missing.</Text>
      <Pressable
        disabled={busy}
        onPress={restoreDefaults}
        style={{
          marginTop: 12,
          paddingVertical: 12,
          borderRadius: 8,
          backgroundColor: busy ? '#9DBEBC' : '#2A6F6B',
          alignItems: 'center',
        }}
      >
        {busy ? <ActivityIndicator color="white" /> : <Text style={{ color: 'white', fontWeight: '600' }}>Restore default stretches</Text>}
      </Pressable>

      {message && <Text style={{ marginTop: 12, color: '#2A6F6B' }}>{message}</Text>}
    </ScrollView>
  );
}