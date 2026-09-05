import { Stack, useLocalSearchParams, useRouter } from 'expo-router';
import { useState } from 'react';
import { ActivityIndicator, Pressable, ScrollView, Text, TextInput, View } from 'react-native';
import { BODY_AREAS } from '@/data/stretches';
import { useStretches } from '@/lib/stretches-store';

const DIFFICULTIES = ['Easy', 'Medium', 'Hard'];

export default function StretchForm() {
  const { id } = useLocalSearchParams<{ id?: string }>();
  const router = useRouter();
  const { stretches, addStretch, editStretch } = useStretches();

  const isEditing = Boolean(id);
  const existing = stretches.find((s) => String(s.id) === String(id));

  // Form fields. Pre-filled from the existing record when editing.
  const [name, setName] = useState(existing?.name ?? '');
  const [area, setArea] = useState(existing?.area ?? BODY_AREAS[0]);
  const [seconds, setSeconds] = useState(String(existing?.seconds ?? '30'));
  const [difficulty, setDifficulty] = useState(existing?.difficulty ?? 'Easy');
  const [summary, setSummary] = useState(existing?.summary ?? '');
  const [steps, setSteps] = useState((existing?.steps ?? []).join('\n'));
  const [commonMistake, setCommonMistake] = useState(existing?.commonMistake ?? '');

  const [saving, setSaving] = useState(false);
  const [formError, setFormError] = useState<string | null>(null);

  async function save() {
    if (name.trim().length === 0) {
      setFormError('Give the stretch a name.');
      return;
    }

    setSaving(true);
    setFormError(null);

    const payload = {
      name: name.trim(),
      area,
      seconds: Number(seconds) || 30,
      difficulty,
      summary: summary.trim(),
      // One step per line in the box, stored as an array on the server.
      steps: steps.split('\n').map((line) => line.trim()).filter(Boolean),
      commonMistake: commonMistake.trim(),
    };

    try {
      if (isEditing) {
        await editStretch(existing.id, payload);
      } else {
        await addStretch(payload);
      }
      router.back();
    } catch {
      setFormError('Could not save. The server did not respond — check your connection.');
      setSaving(false);
    }
  }

  return (
    <ScrollView style={{ flex: 1, backgroundColor: 'white' }} contentContainerStyle={{ padding: 20 }}>
      <Stack.Screen options={{ title: isEditing ? 'Edit stretch' : 'Add stretch' }} />

      <Field label="Name">
        <TextInput value={name} onChangeText={setName} placeholder="Seated Spinal Twist" style={inputStyle} />
      </Field>

      <Field label="Body area">
        <Chips options={BODY_AREAS} selected={area} onSelect={setArea} />
      </Field>

      <Field label="Hold time (seconds)">
        <TextInput value={seconds} onChangeText={setSeconds} keyboardType="number-pad" style={inputStyle} />
      </Field>

      <Field label="Difficulty">
        <Chips options={DIFFICULTIES} selected={difficulty} onSelect={setDifficulty} />
      </Field>

      <Field label="Summary">
        <TextInput value={summary} onChangeText={setSummary} multiline style={[inputStyle, { height: 70 }]} />
      </Field>

      <Field label="Steps (one per line)">
        <TextInput value={steps} onChangeText={setSteps} multiline style={[inputStyle, { height: 110 }]} />
      </Field>

      <Field label="Common mistake">
        <TextInput value={commonMistake} onChangeText={setCommonMistake} multiline style={[inputStyle, { height: 70 }]} />
      </Field>

      {formError && <Text style={{ color: '#A33', marginBottom: 12 }}>{formError}</Text>}

      <Pressable
        disabled={saving}
        onPress={save}
        style={{
          paddingVertical: 14,
          borderRadius: 8,
          backgroundColor: saving ? '#9DBEBC' : '#2A6F6B',
          alignItems: 'center',
          marginBottom: 40,
        }}
      >
        {saving ? <ActivityIndicator color="white" /> : <Text style={{ color: 'white', fontWeight: '600' }}>{isEditing ? 'Save changes' : 'Add stretch'}</Text>}
      </Pressable>
    </ScrollView>
  );
}

// Small local components keep the form readable instead of one giant block.
function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <View style={{ marginBottom: 16 }}>
      <Text style={{ fontWeight: '600', marginBottom: 6 }}>{label}</Text>
      {children}
    </View>
  );
}

function Chips({ options, selected, onSelect }: { options: string[]; selected: string; onSelect: (value: string) => void }) {
  return (
    <View style={{ flexDirection: 'row', flexWrap: 'wrap' }}>
      {options.map((option) => (
        <Pressable
          key={option}
          onPress={() => onSelect(option)}
          style={{
            paddingVertical: 6,
            paddingHorizontal: 12,
            marginRight: 8,
            marginBottom: 8,
            borderRadius: 16,
            backgroundColor: selected === option ? '#2A6F6B' : '#EEE',
          }}
        >
          <Text style={{ color: selected === option ? 'white' : '#333' }}>{option}</Text>
        </Pressable>
      ))}
    </View>
  );
}

const inputStyle = {
  borderWidth: 1,
  borderColor: '#DDD',
  borderRadius: 8,
  padding: 10,
  fontSize: 15,
  textAlignVertical: 'top' as const,
};