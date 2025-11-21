import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  Image,
  TouchableOpacity,
  Alert,
  ScrollView,
  Dimensions,
} from 'react-native';
import { Product } from '../types';

interface HomeScreenProps {
  onAddToCart: (product: Product) => void;
}

const { width } = Dimensions.get('window');

const organicProducts: Product[] = [
  {
    id: '1',
    name: 'Organic Red Apples',
    category: 'Fresh Fruits',
    weight: '1 kg',
    price: 180,
    image: 'https://images.unsplash.com/photo-1560806887-1e4cd0b6cbd6?w=300',
    inStock: true,
  },
  {
    id: '2',
    name: 'Farm Fresh Bananas',
    category: 'Fresh Fruits',
    weight: '1 dozen',
    price: 80,
    image: 'https://images.unsplash.com/photo-1571771894821-ce9b6c11b08e?w=300',
    inStock: true,
  },
  {
    id: '3',
    name: 'Organic Spinach',
    category: 'Leafy Greens',
    weight: '500g',
    price: 45,
    image: 'https://images.unsplash.com/photo-1576045057995-568f588f82fb?w=300',
    inStock: true,
  },
  {
    id: '4',
    name: 'Fresh Tomatoes',
    category: 'Vegetables',
    weight: '1 kg',
    price: 60,
    image: 'https://images.unsplash.com/photo-1592924357228-91a4daadcfea?w=300',
    inStock: true,
  },
  {
    id: '5',
    name: 'Organic Carrots',
    category: 'Root Vegetables',
    weight: '750g',
    price: 55,
    image: 'https://images.unsplash.com/photo-1582515073490-39981397c445?w=300',
    inStock: true,
  },
  {
    id: '6',
    name: 'Farm Fresh Eggs',
    category: 'Dairy & Eggs',
    weight: '12 pieces',
    price: 140,
    image: 'https://images.unsplash.com/photo-1582722872445-44dc5f7e3c8f?w=300',
    inStock: true,
  },
  {
    id: '7',
    name: 'Organic Honey',
    category: 'Natural Products',
    weight: '500ml',
    price: 320,
    image: 'https://images.unsplash.com/photo-1587049016823-69c174b4ce0a?w=300',
    inStock: true,
  },
  {
    id: '8',
    name: 'Fresh Basil',
    category: 'Herbs',
    weight: '100g',
    price: 25,
    image: 'https://images.unsplash.com/photo-1618164436241-4473940d1f5c?w=300',
    inStock: false,
  },
];

const categories = ['All', 'Fresh Fruits', 'Vegetables', 'Leafy Greens', 'Herbs', 'Dairy & Eggs', 'Natural Products'];

const HomeScreen: React.FC<HomeScreenProps> = ({ onAddToCart }) => {
  const [selectedCategory, setSelectedCategory] = useState('All');

  const handleAddToCart = (product: Product) => {
    if (!product.inStock) {
      Alert.alert('Out of Stock', `${product.name} is currently out of stock.`);
      return;
    }
    onAddToCart(product);
    Alert.alert('Added to Cart', `${product.name} has been added to your cart!`);
  };

  const filteredProducts = selectedCategory === 'All' 
    ? organicProducts 
    : organicProducts.filter(product => product.category === selectedCategory);

  const renderCategory = ({ item }: { item: string }) => (
    <TouchableOpacity
      style={[
        styles.categoryChip,
        selectedCategory === item && styles.selectedCategory
      ]}
      onPress={() => setSelectedCategory(item)}
    >
      <Text style={[
        styles.categoryText,
        selectedCategory === item && styles.selectedCategoryText
      ]}>
        {item}
      </Text>
    </TouchableOpacity>
  );

  const renderProduct = ({ item }: { item: Product }) => (
    <View style={styles.productCard}>
      <Image source={{ uri: item.image }} style={styles.productImage} />
      <View style={styles.productInfo}>
        <Text style={styles.productName}>{item.name}</Text>
        <Text style={styles.productCategory}>{item.category}</Text>
        <Text style={styles.productWeight}>{item.weight}</Text>
        <View style={styles.productFooter}>
          <Text style={styles.productPrice}>₹{item.price}</Text>
          <TouchableOpacity
            style={[
              styles.addButton,
              !item.inStock && styles.disabledButton
            ]}
            onPress={() => handleAddToCart(item)}
            disabled={!item.inStock}
          >
            <Text style={[
              styles.addButtonText,
              !item.inStock && styles.disabledButtonText
            ]}>
              {item.inStock ? 'Add' : 'Out of Stock'}
            </Text>
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );

  const OwnerProfile = () => (
    <View style={styles.ownerSection}>
      <Image 
        source={require('../assets/Sanjay.png')} 
        style={styles.ownerImage} 
      />
      <View style={styles.ownerInfo}>
        <Text style={styles.ownerName}>Welcome to Hlthfy!</Text>
        <Text style={styles.ownerTitle}>Your Trusted Organic Partner</Text>
        <Text style={styles.ownerDescription}>
          "Hi, I'm Sanjay, the founder of Hlthfy. My mission is bringing you the freshest organic produce 
          directly from our sustainable farms. Quality and health are my top priorities."
        </Text>
      </View>
    </View>
  );

  const HeroBanner = () => (
    <View style={styles.heroBanner}>
      <Text style={styles.heroTitle}>🌱 Fresh Organic Produce</Text>
      <Text style={styles.heroSubtitle}>Farm Fresh • Chemical Free • Delivered Daily</Text>
      <View style={styles.heroStats}>
        <View style={styles.statItem}>
          <Text style={styles.statNumber}>100%</Text>
          <Text style={styles.statLabel}>Organic</Text>
        </View>
        <View style={styles.statItem}>
          <Text style={styles.statNumber}>0</Text>
          <Text style={styles.statLabel}>Chemicals</Text>
        </View>
        <View style={styles.statItem}>
          <Text style={styles.statNumber}>24hrs</Text>
          <Text style={styles.statLabel}>Fresh</Text>
        </View>
      </View>
    </View>
  );

  return (
    <View style={styles.container}>
      <ScrollView showsVerticalScrollIndicator={false}>
        {/* Hero Banner */}
        <HeroBanner />

        {/* Owner Profile */}
        <OwnerProfile />

        {/* Categories */}
        <View style={styles.categoriesSection}>
          <Text style={styles.sectionTitle}>Shop by Category</Text>
          <FlatList
            data={categories}
            renderItem={renderCategory}
            keyExtractor={(item) => item}
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={styles.categoriesList}
          />
        </View>

        {/* Products */}
        <View style={styles.productsSection}>
          <Text style={styles.sectionTitle}>
            {selectedCategory === 'All' ? 'All Products' : selectedCategory} ({filteredProducts.length})
          </Text>
          <FlatList
            data={filteredProducts}
            renderItem={renderProduct}
            keyExtractor={(item) => item.id}
            numColumns={2}
            scrollEnabled={false}
            contentContainerStyle={styles.productList}
          />
        </View>
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F9FAFB',
  },
  heroBanner: {
    backgroundColor: '#059669',
    padding: 20,
    paddingTop: 60,
    alignItems: 'center',
  },
  heroTitle: {
    fontSize: 28,
    fontWeight: 'bold',
    color: 'white',
    textAlign: 'center',
    marginBottom: 8,
  },
  heroSubtitle: {
    fontSize: 16,
    color: '#E5F9F0',
    textAlign: 'center',
    marginBottom: 20,
  },
  heroStats: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    width: '100%',
  },
  statItem: {
    alignItems: 'center',
  },
  statNumber: {
    fontSize: 24,
    fontWeight: 'bold',
    color: 'white',
  },
  statLabel: {
    fontSize: 12,
    color: '#E5F9F0',
    marginTop: 4,
  },
  ownerSection: {
    backgroundColor: 'white',
    margin: 16,
    borderRadius: 16,
    padding: 20,
    flexDirection: 'row',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 5,
  },
  ownerImage: {
    width: 80,
    height: 80,
    borderRadius: 40,
    marginRight: 16,
  },
  ownerInfo: {
    flex: 1,
  },
  ownerName: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#111827',
    marginBottom: 4,
  },
  ownerTitle: {
    fontSize: 14,
    color: '#059669',
    fontWeight: '600',
    marginBottom: 8,
  },
  ownerDescription: {
    fontSize: 14,
    color: '#6B7280',
    lineHeight: 20,
  },
  categoriesSection: {
    paddingHorizontal: 16,
    marginBottom: 20,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#111827',
    marginBottom: 16,
  },
  categoriesList: {
    paddingRight: 16,
  },
  categoryChip: {
    backgroundColor: 'white',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    marginRight: 8,
    borderWidth: 1,
    borderColor: '#E5E7EB',
  },
  selectedCategory: {
    backgroundColor: '#059669',
    borderColor: '#059669',
  },
  categoryText: {
    fontSize: 14,
    color: '#6B7280',
    fontWeight: '500',
  },
  selectedCategoryText: {
    color: 'white',
  },
  productsSection: {
    paddingHorizontal: 16,
    paddingBottom: 100,
  },
  productList: {
    paddingTop: 8,
  },
  productCard: {
    flex: 1,
    backgroundColor: 'white',
    borderRadius: 16,
    margin: 6,
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 5,
  },
  productImage: {
    width: '100%',
    height: 140,
    backgroundColor: '#E5E7EB',
  },
  productInfo: {
    padding: 16,
  },
  productName: {
    fontSize: 16,
    fontWeight: '600',
    color: '#111827',
    marginBottom: 4,
  },
  productCategory: {
    fontSize: 12,
    color: '#059669',
    fontWeight: '500',
    marginBottom: 2,
  },
  productWeight: {
    fontSize: 12,
    color: '#9CA3AF',
    marginBottom: 12,
  },
  productFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  productPrice: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#059669',
  },
  addButton: {
    backgroundColor: '#059669',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 8,
  },
  disabledButton: {
    backgroundColor: '#E5E7EB',
  },
  addButtonText: {
    fontSize: 12,
    fontWeight: '600',
    color: 'white',
  },
  disabledButtonText: {
    color: '#9CA3AF',
  },
});

export default HomeScreen;
