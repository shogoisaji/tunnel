import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  SafeAreaView,
  StatusBar,
  ScrollView,
  Alert,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useMemoStore } from '../store/memoStore';
import { MEMO_COLORS } from '../utils/colors';
import * as Haptics from 'expo-haptics';

interface EditMemoScreenProps {
  navigation: any;
  route: any;
}

export const EditMemoScreen: React.FC<EditMemoScreenProps> = ({ navigation, route }) => {
  const { memoId } = route.params;
  const { memos, updateMemo, deleteMemo } = useMemoStore();
  
  const memo = memos.find(m => m.id === memoId);
  
  const [title, setTitle] = useState(memo?.title || '');
  const [content, setContent] = useState(memo?.content || '');
  const [tags, setTags] = useState<string[]>(memo?.tags || []);
  const [tagInput, setTagInput] = useState('');
  const [selectedColor, setSelectedColor] = useState(memo?.color || MEMO_COLORS[0]);

  useEffect(() => {
    if (!memo) {
      Alert.alert('エラー', 'メモが見つかりません', [
        { text: 'OK', onPress: () => navigation.goBack() }
      ]);
    }
  }, [memo, navigation]);

  if (!memo) {
    return null;
  }

  const handleSave = () => {
    if (!title.trim() && !content.trim()) {
      Alert.alert('エラー', 'タイトルまたは内容を入力してください');
      return;
    }

    updateMemo(memoId, {
      title: title.trim(),
      content: content.trim(),
      tags,
      color: selectedColor,
    });

    Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
    navigation.goBack();
  };

  const handleDelete = () => {
    Alert.alert(
      'メモを削除',
      `「${memo.title || 'Untitled'}」を削除しますか？`,
      [
        { text: 'キャンセル', style: 'cancel' },
        {
          text: '削除',
          style: 'destructive',
          onPress: () => {
            deleteMemo(memoId);
            navigation.goBack();
          },
        },
      ]
    );
  };

  const handleAddTag = () => {
    const trimmedTag = tagInput.trim();
    if (trimmedTag && !tags.includes(trimmedTag)) {
      setTags([...tags, trimmedTag]);
      setTagInput('');
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    }
  };

  const handleRemoveTag = (tagToRemove: string) => {
    setTags(tags.filter(tag => tag !== tagToRemove));
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
  };

  const handleColorSelect = (color: string) => {
    setSelectedColor(color);
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
  };

  const togglePin = () => {
    updateMemo(memoId, { isPinned: !memo.isPinned });
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
  };

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor="#fff" />
      
      <KeyboardAvoidingView 
        style={styles.keyboardContainer}
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      >
        <View style={styles.header}>
          <TouchableOpacity onPress={() => navigation.goBack()}>
            <Ionicons name="arrow-back" size={24} color="#333" />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>メモを編集</Text>
          <View style={styles.headerActions}>
            <TouchableOpacity onPress={togglePin} style={styles.iconButton}>
              <Ionicons
                name={memo.isPinned ? 'bookmark' : 'bookmark-outline'}
                size={24}
                color="#007AFF"
              />
            </TouchableOpacity>
            <TouchableOpacity onPress={handleDelete} style={styles.iconButton}>
              <Ionicons name="trash-outline" size={24} color="#FF3B30" />
            </TouchableOpacity>
            <TouchableOpacity onPress={handleSave} style={styles.saveButton}>
              <Text style={styles.saveButtonText}>保存</Text>
            </TouchableOpacity>
          </View>
        </View>

        <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
          <View style={styles.metaInfo}>
            <Text style={styles.metaText}>
              作成: {memo.createdAt.toLocaleDateString('ja-JP', {
                year: 'numeric',
                month: 'long',
                day: 'numeric',
                hour: '2-digit',
                minute: '2-digit',
              })}
            </Text>
            <Text style={styles.metaText}>
              更新: {memo.updatedAt.toLocaleDateString('ja-JP', {
                year: 'numeric',
                month: 'long',
                day: 'numeric',
                hour: '2-digit',
                minute: '2-digit',
              })}
            </Text>
          </View>

          <View style={styles.section}>
            <Text style={styles.sectionTitle}>タイトル</Text>
            <TextInput
              style={styles.titleInput}
              placeholder="メモのタイトルを入力..."
              value={title}
              onChangeText={setTitle}
              maxLength={100}
            />
          </View>

          <View style={styles.section}>
            <Text style={styles.sectionTitle}>内容</Text>
            <TextInput
              style={styles.contentInput}
              placeholder="メモの内容を入力..."
              value={content}
              onChangeText={setContent}
              multiline
              textAlignVertical="top"
            />
          </View>

          <View style={styles.section}>
            <Text style={styles.sectionTitle}>タグ</Text>
            <View style={styles.tagInputContainer}>
              <TextInput
                style={styles.tagInput}
                placeholder="タグを追加..."
                value={tagInput}
                onChangeText={setTagInput}
                onSubmitEditing={handleAddTag}
                returnKeyType="done"
              />
              <TouchableOpacity onPress={handleAddTag} style={styles.addTagButton}>
                <Ionicons name="add" size={20} color="#007AFF" />
              </TouchableOpacity>
            </View>
            
            {tags.length > 0 && (
              <View style={styles.tagsContainer}>
                {tags.map((tag, index) => (
                  <TouchableOpacity
                    key={index}
                    style={styles.tag}
                    onPress={() => handleRemoveTag(tag)}
                  >
                    <Text style={styles.tagText}>#{tag}</Text>
                    <Ionicons name="close" size={16} color="#666" />
                  </TouchableOpacity>
                ))}
              </View>
            )}
          </View>

          <View style={styles.section}>
            <Text style={styles.sectionTitle}>カラー</Text>
            <View style={styles.colorContainer}>
              {MEMO_COLORS.map((color, index) => (
                <TouchableOpacity
                  key={index}
                  style={[
                    styles.colorOption,
                    { backgroundColor: color },
                    selectedColor === color && styles.selectedColor,
                  ]}
                  onPress={() => handleColorSelect(color)}
                >
                  {selectedColor === color && (
                    <Ionicons name="checkmark" size={20} color="#333" />
                  )}
                </TouchableOpacity>
              ))}
            </View>
          </View>

          <View style={styles.previewSection}>
            <Text style={styles.sectionTitle}>プレビュー</Text>
            <View style={[styles.previewCard, { backgroundColor: selectedColor }]}>
              <Text style={styles.previewTitle}>
                {title || 'タイトル'}
              </Text>
              <Text style={styles.previewContent}>
                {content || 'メモの内容がここに表示されます...'}
              </Text>
              {tags.length > 0 && (
                <View style={styles.previewTags}>
                  {tags.slice(0, 3).map((tag, index) => (
                    <Text key={index} style={styles.previewTag}>
                      #{tag}
                    </Text>
                  ))}
                </View>
              )}
            </View>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8f9fa',
  },
  keyboardContainer: {
    flex: 1,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 16,
    backgroundColor: '#fff',
    borderBottomWidth: 1,
    borderBottomColor: '#e9ecef',
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#333',
    flex: 1,
    marginLeft: 16,
  },
  headerActions: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  iconButton: {
    padding: 8,
    marginLeft: 8,
  },
  saveButton: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    backgroundColor: '#007AFF',
    borderRadius: 20,
    marginLeft: 8,
  },
  saveButtonText: {
    color: '#fff',
    fontWeight: '600',
    fontSize: 16,
  },
  content: {
    flex: 1,
    paddingHorizontal: 20,
  },
  metaInfo: {
    backgroundColor: '#fff',
    padding: 16,
    borderRadius: 12,
    marginTop: 16,
  },
  metaText: {
    fontSize: 14,
    color: '#666',
    marginBottom: 4,
  },
  section: {
    marginTop: 24,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
    marginBottom: 12,
  },
  titleInput: {
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingVertical: 12,
    fontSize: 16,
    backgroundColor: '#fff',
  },
  contentInput: {
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingVertical: 12,
    fontSize: 16,
    backgroundColor: '#fff',
    minHeight: 120,
  },
  tagInputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  tagInput: {
    flex: 1,
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingVertical: 12,
    fontSize: 16,
    backgroundColor: '#fff',
    marginRight: 12,
  },
  addTagButton: {
    padding: 12,
    backgroundColor: '#fff',
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#007AFF',
  },
  tagsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginTop: 12,
  },
  tag: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#e9ecef',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
    marginRight: 8,
    marginBottom: 8,
  },
  tagText: {
    fontSize: 14,
    color: '#333',
    marginRight: 6,
  },
  colorContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
  },
  colorOption: {
    width: 40,
    height: 40,
    borderRadius: 20,
    marginRight: 12,
    marginBottom: 12,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 2,
    borderColor: 'transparent',
  },
  selectedColor: {
    borderColor: '#007AFF',
  },
  previewSection: {
    marginTop: 24,
    marginBottom: 40,
  },
  previewCard: {
    padding: 16,
    borderRadius: 16,
    minHeight: 120,
  },
  previewTitle: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 8,
    color: '#333',
  },
  previewContent: {
    fontSize: 14,
    lineHeight: 20,
    color: '#333',
    marginBottom: 12,
  },
  previewTags: {
    flexDirection: 'row',
    flexWrap: 'wrap',
  },
  previewTag: {
    fontSize: 12,
    color: '#666',
    marginRight: 8,
    marginBottom: 4,
  },
});
