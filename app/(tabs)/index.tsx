import { useRouter } from 'expo-router';
import { useState } from 'react';
import { FlatList, Pressable, Text, View } from 'react-native';
import { BODY_AREAS, STRETCHES } from '../../data/stretches';

export default function HomeScreen() {
  const router = useRouter();
  const [selectedArea, setSelectedArea] = useState('All');
  const [tapCount, setTapCount] = useState(0);

  const filters = ['All', ...BODY_AREAS];

  const visibleStretches =
    selectedArea === 'All'
      ? STRETCHES
      : STRETCHES.filter((s) => s.area === selectedArea);

  return (
    <View style={{ flex: 1, backgroundColor: 'white', paddingTop: 60, paddingHorizontal: 20 }}>
      <Text style={{ fontSize: 26, fontWeight: 'bold' }}>Desk Reset</Text>
      <Text style={{ marginTop: 4, marginBottom: 16, color: '#666' }}>
        Showing {visibleStretches.length} stretches · {tapCount} viewed
      </Text>

      <View style={{ flexDirection: 'row', flexWrap: 'wrap', marginBottom: 16 }}>
        {filters.map((area) => (
          <Pressable
            key={area}
            onPress={() => setSelectedArea(area)}
            style={{
              paddingVertical: 6,
              paddingHorizontal: 12,
              marginRight: 8,
              marginBottom: 8,
              borderRadius: 16,
              backgroundColor: selectedArea === area ? '#2A6F6B' : '#EEE',
            }}
          >
            <Text style={{ color: selectedArea === area ? 'white' : '#333' }}>{area}</Text>
          </Pressable>
        ))}
      </View>

      <FlatList
        data={visibleStretches}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <Pressable
            onPress={() => {
              setTapCount(tapCount + 1);
              router.push(`/stretch/${item.id}`);
            }}
            style={{ paddingVertical: 14, borderBottomWidth: 1, borderBottomColor: '#EEE' }}
          >
            <Text style={{ fontSize: 17, color: 'black' }}>{item.name}</Text>
            <Text style={{ fontSize: 13, color: '#777', marginTop: 2 }}>
              {item.area} · {item.seconds}s
            </Text>
          </Pressable>
        )}
      />
    </View>
  );
}