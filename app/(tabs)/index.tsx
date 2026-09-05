import { useRouter } from 'expo-router';
import { useState } from 'react';
import { ActivityIndicator, FlatList, Pressable, RefreshControl, Text, View } from 'react-native';
import { useStretches } from '@/lib/stretches-store';

export default function HomeScreen() {
  const router = useRouter();
  const { stretches, loading, error, usingCache, reload } = useStretches();

  const [selectedArea, setSelectedArea] = useState('All');
  const [tapCount, setTapCount] = useState(0);

  // Filter options come from the data itself, so a stretch in a new body
  // area shows up without editing this file.
  const areas = ['All', ...Array.from(new Set(stretches.map((s) => s.area).filter(Boolean)))];

  const visibleStretches =
    selectedArea === 'All' ? stretches : stretches.filter((s) => s.area === selectedArea);

  // 1. LOADING STATE - first fetch, nothing to show yet
  if (loading && stretches.length === 0) {
    return (
      <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center', backgroundColor: 'white' }}>
        <ActivityIndicator size="large" color="#2A6F6B" />
        <Text style={{ marginTop: 12, color: '#666' }}>Loading stretches…</Text>
      </View>
    );
  }

  // 2. ERROR STATE - no server, no cache
  if (error) {
    return (
      <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center', padding: 32, backgroundColor: 'white' }}>
        <Text style={{ fontSize: 17, fontWeight: '600', textAlign: 'center' }}>Nothing to show yet</Text>
        <Text style={{ marginTop: 8, color: '#666', textAlign: 'center' }}>{error}</Text>
        <Pressable
          onPress={reload}
          style={{ marginTop: 20, paddingVertical: 10, paddingHorizontal: 20, borderRadius: 8, backgroundColor: '#2A6F6B' }}
        >
          <Text style={{ color: 'white', fontWeight: '600' }}>Try again</Text>
        </Pressable>
      </View>
    );
  }

  return (
    <View style={{ flex: 1, backgroundColor: 'white', paddingTop: 60, paddingHorizontal: 20 }}>
      <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' }}>
        <Text style={{ fontSize: 26, fontWeight: 'bold' }}>Desk Reset</Text>
        <Pressable
          onPress={() => router.push('/stretch-form')}
          style={{ paddingVertical: 6, paddingHorizontal: 14, borderRadius: 8, backgroundColor: '#2A6F6B' }}
        >
          <Text style={{ color: 'white', fontWeight: '600' }}>Add</Text>
        </Pressable>
      </View>

      <Text style={{ marginTop: 4, marginBottom: 12, color: '#666' }}>
        Showing {visibleStretches.length} stretches · {tapCount} viewed
      </Text>

      {/* 3. OFFLINE BANNER - shown when the list came from the cache */}
      {usingCache && (
        <View style={{ padding: 10, borderRadius: 8, backgroundColor: '#FFF4E5', marginBottom: 12 }}>
          <Text style={{ color: '#8A5A00' }}>Offline — showing the last saved copy. Pull down to retry.</Text>
        </View>
      )}

      <View style={{ flexDirection: 'row', flexWrap: 'wrap', marginBottom: 12 }}>
        {areas.map((area) => (
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
        keyExtractor={(item) => String(item.id)}
        refreshControl={<RefreshControl refreshing={loading} onRefresh={reload} tintColor="#2A6F6B" />}
        // 4. EMPTY STATE - request succeeded, there is just no data
        ListEmptyComponent={
          <View style={{ paddingTop: 40, alignItems: 'center' }}>
            <Text style={{ fontSize: 16, fontWeight: '600' }}>
              {selectedArea === 'All' ? 'No stretches on the server yet' : `No ${selectedArea} stretches yet`}
            </Text>
            <Text style={{ marginTop: 6, color: '#666', textAlign: 'center' }}>
              {selectedArea === 'All'
                ? 'Add one with the Add button, or restore the defaults from Settings.'
                : 'Pick another body area, or add one.'}
            </Text>
          </View>
        }
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