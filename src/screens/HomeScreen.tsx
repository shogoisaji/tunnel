import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  TextInput,
  SafeAreaView,
  StatusBar,
  Alert,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useMemoStore, loadMemosFromDatabase } from '../store/memoStore';
import { MemoCard } from '../components/MemoCard';
import { initDatabase } from '../database/database';
import * as Haptics from 'expo-haptics';

interface HomeScreenProps {
  navigation: any;
}

export const HomeScreen: React.FC<HomeScreenProps> = ({ navigation }) => {
  const {
    memos,
    searchQuery,
    setSearchQuery,
    deleteMemo,
    togglePin,
  } = useMemoStore();

  const [isSearchVisible, setIsSearchVisible] = useState(false);

  useEffect(() => {
    initDatabase();
    loadMemosFromDatabase();
  }, []);

  const filteredMemos = memos.filter(memo =>
    memo.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    memo.content.toLowerCase().includes(searchQuery.toLowerCase()) ||
    memo.tags.some(tag => tag.toLowerCase().includes(searchQuery.toLowerCase()))
  );

  const handleDeleteMemo = (id: string, title: string) => {
    Alert.alert(
      'メモを削除',
      `「${title || 'Untitled'}」を削除しますか？`,
      [
        { text: 'キャンセル', style: 'cancel' },
        {
          text: '削除',
          style: 'destructive',
          onPress: () => deleteMemo(id),
        },
      ]
    );
  };

  const handleCreateMemo = () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    navigation.navigate('CreateMemo');
  };

  const handleEditMemo = (memoId: string) => {
    navigation.navigate('EditMemo', { memoId });
  };

  const toggleSearch = () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    setIsSearchVisible(!isSearchVisible);
    if (isSearchVisible) {
      setSearchQuery('');
    }
  };

  const renderMemoCard = ({ item, index }: { item: any; index: number }) => (
    <View style={index % 2 === 0 ? styles.leftCard : styles.rightCard}>
      <MemoCard
        memo={item}
        onPress={() => handleEditMemo(item.id)}
        onPin={() => togglePin(item.id)}
        onDelete={() => handleDeleteMemo(item.id, item.title)}
      />
    </View>
  );

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor="#fff" />
      
      <View style={styles.header}>
        <Text style={styles.title}>📝 Tunnel Notes</Text>
        <View style={styles.headerActions}>
          <TouchableOpacity onPress={toggleSearch} style={styles.iconButton}>
            <Ionicons 
              name={isSearchVisible ? "close" : "search"} 
              size={24} 
              color="#333" 
            />
          </TouchableOpacity>
        </View>
      </View>

      {isSearchVisible && (
        <View style={styles.searchContainer}>
          <TextInput
            style={styles.searchInput}
            placeholder="メモを検索..."
            value={searchQuery}
            onChangeText={setSearchQuery}
            autoFocus
          />
        </View>
      )}

      <View style={styles.statsContainer}>
        <Text style={styles.statsText}>
          {filteredMemos.length} 件のメモ
        </Text>
        {filteredMemos.filter(m => m.isPinned).length > 0 && (
          <Text style={styles.pinnedText}>
            📌 {filteredMemos.filter(m => m.isPinned).length} 件ピン留め
          </Text>
        )}
      </View>

      {filteredMemos.length === 0 ? (
        <View style={styles.emptyContainer}>
          <Ionicons name="document-text-outline" size={64} color="#ccc" />
          <Text style={styles.emptyTitle}>
            {searchQuery ? '検索結果がありません' : 'メモがありません'}
          </Text>
          <Text style={styles.emptySubtitle}>
            {searchQuery ? '別のキーワードで検索してみてください' : '最初のメモを作成しましょう！'}
          </Text>
        </View>
      ) : (
        <FlatList
          data={filteredMemos}
          renderItem={renderMemoCard}
          keyExtractor={(item) => item.id}
          numColumns={2}
          contentContainerStyle={styles.listContainer}
          showsVerticalScrollIndicator={false}
        />
      )}

      <TouchableOpacity style={styles.fab} onPress={handleCreateMemo}>
        <Ionicons name="add" size={28} color="#fff" />
      </TouchableOpacity>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8f9fa',
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
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#333',
  },
  headerActions: {
    flexDirection: 'row',
  },
  iconButton: {
    padding: 8,
    marginLeft: 8,
  },
  searchContainer: {
    paddingHorizontal: 20,
    paddingVertical: 12,
    backgroundColor: '#fff',
    borderBottomWidth: 1,
    borderBottomColor: '#e9ecef',
  },
  searchInput: {
    height: 40,
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 20,
    paddingHorizontal: 16,
    fontSize: 16,
    backgroundColor: '#f8f9fa',
  },
  statsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 12,
  },
  statsText: {
    fontSize: 14,
    color: '#666',
    fontWeight: '500',
  },
  pinnedText: {
    fontSize: 14,
    color: '#007AFF',
    fontWeight: '500',
  },
  listContainer: {
    paddingHorizontal: 16,
    paddingTop: 8,
    paddingBottom: 100,
  },
  leftCard: {
    flex: 1,
    paddingRight: 8,
  },
  rightCard: {
    flex: 1,
    paddingLeft: 8,
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 40,
  },
  emptyTitle: {
    fontSize: 20,
    fontWeight: '600',
    color: '#333',
    marginTop: 16,
    textAlign: 'center',
  },
  emptySubtitle: {
    fontSize: 16,
    color: '#666',
    marginTop: 8,
    textAlign: 'center',
    lineHeight: 22,
  },
  fab: {
    position: 'absolute',
    bottom: 30,
    right: 20,
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: '#007AFF',
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 8,
  },
});
