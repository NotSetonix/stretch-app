import { Stack, useLocalSearchParams, useRouter } from 'expo-router';
import { useState } from 'react';
import { ActivityIndicator, Alert, Pressable, ScrollView, Text } from 'react-native';
import { useStretches } from '@/lib/stretches-store';

export default function StretchDetail() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const router = useRouter();
  const { stretches, removeStretch } = useStretches();
  const [deleting, setDeleting] = useState(false);

  const stretch = stretches.find((s) => String(s.id) === String(id));

  if (!stretch) {
    return <Text style={{ padding: 20 }}>Stretch not found.</Text>;
  }

  function confirmDelete() {
    Alert.alert('Delete this stretch?', `"${stretch.name}" will be removed from the server.`, [
      { text: 'Cancel', style: 'cancel' },
      {
        text: 'Delete',
        style: 'destructive',
        onPress: async () => {
          setDeleting(true);
          try {
            await removeStretch(stretch.id);
            router.back();
          } catch {
            setDeleting(false);
            Alert.alert('Could not delete', 'The server did not respond. Check your connection and try again.');
          }
        },
      },
    ]);
  }

  return (
    <ScrollView style={{ flex: 1, backgroundColor: 'white', padding: 20 }}>
      <Stack.Screen options={{ title: stretch.name }} />

      <Text style={{ fontSize: 24, fontWeight: 'bold' }}>{stretch.name}</Text>
      <Text style={{ marginTop: 8 }}>
        {stretch.area} · {stretch.seconds} seconds · {stretch.difficulty}
      </Text>
      <Text style={{ marginTop: 16 }}>{stretch.summary}</Text>

      <Text style={{ marginTop: 24, fontWeight: 'bold' }}>How to do it</Text>
      {(stretch.steps ?? []).map((step: string, index: number) => (
        <Text key={index} style={{ marginTop: 8 }}>
          {index + 1}. {step}
        </Text>
      ))}

      <Text style={{ marginTop: 24, fontWeight: 'bold' }}>Common mistake</Text>
      <Text style={{ marginTop: 8 }}>{stretch.commonMistake}</Text>

      <Pressable
        onPress={() => router.push({ pathname: '/stretch-form', params: { id: String(stretch.id) } })}
        style={{ marginTop: 28, paddingVertical: 12, borderRadius: 8, backgroundColor: '#2A6F6B', alignItems: 'center' }}
      >
        <Text style={{ color: 'white', fontWeight: '600' }}>Edit</Text>
      </Pressable>

      <Pressable
        disabled={deleting}
        onPress={confirmDelete}
        style={{ marginTop: 10, marginBottom: 40, paddingVertical: 12, borderRadius: 8, backgroundColor: '#F3E0E0', alignItems: 'center' }}
      >
        {deleting ? <ActivityIndicator color="#A33" /> : <Text style={{ color: '#A33', fontWeight: '600' }}>Delete</Text>}
      </Pressable>
    </ScrollView>
  );
}