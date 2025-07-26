import React from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Dimensions,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Memo } from '../types/memo';
import { getContrastColor } from '../utils/colors';
import * as Haptics from 'expo-haptics';

interface MemoCardProps {
  memo: Memo;
  onPress: () => void;
  onPin: () => void;
  onDelete: () => void;
}

const { width } = Dimensions.get('window');
const cardWidth = (width - 48) / 2;

export const MemoCard: React.FC<MemoCardProps> = ({
  memo,
  onPress,
  onPin,
  onDelete,
}) => {
  const textColor = getContrastColor(memo.color);

  const handlePin = () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    onPin();
  };

  const handleDelete = () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    onDelete();
  };

  return (
    <TouchableOpacity
      style={[styles.card, { backgroundColor: memo.color }]}
      onPress={onPress}
      activeOpacity={0.8}
    >
      <View style={styles.header}>
        <TouchableOpacity onPress={handlePin} style={styles.pinButton}>
          <Ionicons
            name={memo.isPinned ? 'bookmark' : 'bookmark-outline'}
            size={20}
            color={textColor}
          />
        </TouchableOpacity>
        <TouchableOpacity onPress={handleDelete} style={styles.deleteButton}>
          <Ionicons name="trash-outline" size={18} color={textColor} />
        </TouchableOpacity>
      </View>

      <Text
        style={[styles.title, { color: textColor }]}
        numberOfLines={2}
        ellipsizeMode="tail"
      >
        {memo.title || 'Untitled'}
      </Text>

      <Text
        style={[styles.content, { color: textColor }]}
        numberOfLines={6}
        ellipsizeMode="tail"
      >
        {memo.content}
      </Text>

      {memo.tags.length > 0 && (
        <View style={styles.tagsContainer}>
          {memo.tags.slice(0, 2).map((tag, index) => (
            <View
              key={index}
              style={[
                styles.tag,
                { backgroundColor: `${textColor}20`, borderColor: `${textColor}40` }
              ]}
            >
              <Text style={[styles.tagText, { color: textColor }]}>
                #{tag}
              </Text>
            </View>
          ))}
          {memo.tags.length > 2 && (
            <Text style={[styles.moreTagsText, { color: textColor }]}>
              +{memo.tags.length - 2}
            </Text>
          )}
        </View>
      )}

      <Text style={[styles.date, { color: `${textColor}80` }]}>
        {memo.updatedAt.toLocaleDateString('ja-JP', {
          month: 'short',
          day: 'numeric',
          hour: '2-digit',
          minute: '2-digit',
        })}
      </Text>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  card: {
    width: cardWidth,
    minHeight: 180,
    borderRadius: 16,
    padding: 16,
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 8,
  },
  pinButton: {
    padding: 4,
  },
  deleteButton: {
    padding: 4,
  },
  title: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 8,
    lineHeight: 20,
  },
  content: {
    fontSize: 14,
    lineHeight: 18,
    flex: 1,
    marginBottom: 8,
  },
  tagsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginBottom: 8,
    alignItems: 'center',
  },
  tag: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
    borderWidth: 1,
    marginRight: 6,
    marginBottom: 4,
  },
  tagText: {
    fontSize: 12,
    fontWeight: '500',
  },
  moreTagsText: {
    fontSize: 12,
    fontWeight: '500',
  },
  date: {
    fontSize: 12,
    textAlign: 'right',
  },
});
