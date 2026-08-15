import { useLocalSearchParams } from 'expo-router';
import { ScrollView, Text } from 'react-native';
import { STRETCHES } from '../../data/stretches';

export default function StretchDetail() {
  const { id } = useLocalSearchParams();
  const stretch = STRETCHES.find((s) => s.id === id);

  if (!stretch) {
    return <Text style={{ padding: 20 }}>Stretch not found.</Text>;
  }

  return (
    <ScrollView style={{ flex: 1, backgroundColor: 'white', padding: 20 }}>
      <Text style={{ fontSize: 24, fontWeight: 'bold' }}>{stretch.name}</Text>
      <Text style={{ marginTop: 8 }}>{stretch.area} · {stretch.seconds} seconds · {stretch.difficulty}</Text>
      <Text style={{ marginTop: 16 }}>{stretch.summary}</Text>

      <Text style={{ marginTop: 24, fontWeight: 'bold' }}>How to do it</Text>
      {stretch.steps.map((step, index) => (
        <Text key={index} style={{ marginTop: 8 }}>{index + 1}. {step}</Text>
      ))}

      <Text style={{ marginTop: 24, fontWeight: 'bold' }}>Common mistake</Text>
      <Text style={{ marginTop: 8, marginBottom: 40 }}>{stretch.commonMistake}</Text>
    </ScrollView>
  );
}