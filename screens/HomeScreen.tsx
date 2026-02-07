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
import { PRICE_BY_ID } from '../data/prices';
import { getImageSource } from '../utils/imageMap';

interface HomeScreenProps {
  onAddToCart: (product: Product) => void;
}

const { width } = Dimensions.get('window');

// Image source helper imported from utils/imageMap

export const organicProducts: Product[] = [
  {
    id: '1',
    name: 'GoEarth Bilona Ghee',
    category: 'Organic Dairy',
    weight: '1 Litre',
    price: PRICE_BY_ID['1'],
    image: 'GoEarth_Bilona_Ghee__1_Litre.jpg',
    inStock: true,
    group: 'Organic',
    subcategory: 'Groceries',
  },
  {
    id: '2',
    name: 'Go Earth Premium Brown Sugar',
    category: 'Natural Sweeteners',
    weight: '500g',
    price: PRICE_BY_ID['2'],
    image: 'Go Earth Premium Organic Brown Sugar.jpg',
    inStock: true,
    group: 'Organic',
    subcategory: 'Groceries',
  },
  {
    id: '3',
    name: 'Healthy Organic Jaggery',
    category: 'Natural Sweeteners',
    weight: '1 kg',
    price: PRICE_BY_ID['3'],
    image: 'Healthy Organic Jaggery.jpg',
    inStock: true,
    group: 'Organic',
    subcategory: 'Groceries',
  },
  {
    id: '4',
    name: 'Besan Gram Flour',
    category: 'Organic Flours',
    weight: '1 kg',
    price: PRICE_BY_ID['4'],
    image: 'Besan-Gram Flour.jpg',
    inStock: true,
    group: 'Organic',
    subcategory: 'Groceries',
  },
  {
    id: '5',
    name: 'Black CTC Tea',
    category: 'Organic Beverages',
    weight: '250g',
    price: PRICE_BY_ID['5'],
    image: 'Black CTC Tea.jpg',
    inStock: true,
    group: 'Organic',
    subcategory: 'Groceries',
  },
  {
    id: '6',
    name: 'Amla Candy Sweet',
    category: 'Healthy Snacks',
    weight: '200g',
    price: PRICE_BY_ID['6'],
    image: 'Amla Candy Sweet.jpg',
    inStock: true,
    group: 'Organic',
    subcategory: 'Groceries',
  },
  {
    id: '7',
    name: 'Go Earth Groundnut Seeds',
    category: 'Organic Seeds',
    weight: '500g',
    price: PRICE_BY_ID['7'],
    image: 'Go Earth Organic Groundnut Seed.jpg',
    inStock: true,
    group: 'Organic',
    subcategory: 'Groceries',
  },
  {
    id: '8',
    name: 'Hyper Nature Neem Bar',
    category: 'Natural Skincare',
    weight: '100g',
    price: PRICE_BY_ID['8'],
    image: 'Hyper Nature Neem bathing Bar.jpg',
    inStock: true,
    group: 'Organic',
    subcategory: 'Toiletries',
  },
  {
    id: '9',
    name: 'Aloevera Beauty Bar',
    category: 'Natural Skincare',
    weight: '100g',
    price: PRICE_BY_ID['9'],
    image: 'Aloevera Bar (by Hyper Nature).jpg',
    inStock: true,
    group: 'Organic',
    subcategory: 'Toiletries',
  },
  {
    id: '10',
    name: 'Classic Ubtan Soap',
    category: 'Natural Skincare',
    weight: '100g',
    price: PRICE_BY_ID['10'],
    image: 'Hyper Nature Classic Ubtan Soap(100g).jpg',
    inStock: true,
    group: 'Organic',
    subcategory: 'Toiletries',
  },
  {
    id: '11',
    name: 'Charcoal Detox Bar',
    category: 'Natural Skincare',
    weight: '100g',
    price: PRICE_BY_ID['11'],
    image: 'Hyper Nature Charcoal Bar.jpg',
    inStock: true,
    group: 'Organic',
    subcategory: 'Toiletries',
  },
  {
    id: '12',
    name: 'Premium Bridal Beauty Bar',
    category: 'Natural Skincare',
    weight: '100g',
    price: PRICE_BY_ID['12'],
    image: 'Hyper Nature Premium Bridal Beauty Bar.jpg',
    inStock: true,
    group: 'Organic',
    subcategory: 'Toiletries',
  },
  {
    id: '13',
    name: 'De-Tan Beauty Bar',
    category: 'Natural Skincare',
    weight: '100g',
    price: PRICE_BY_ID['13'],
    image: 'De-Tan Bar (by Hyper Nature).jpg',
    inStock: true,
    group: 'Organic',
    subcategory: 'Toiletries',
  },
  {
    id: '14',
    name: 'Glow Facial Bar',
    category: 'Natural Skincare',
    weight: '100g',
    price: PRICE_BY_ID['14'],
    image: 'Glow Facial Bar.jpg',
    inStock: true,
    group: 'Organic',
    subcategory: 'Toiletries',
  },
  {
    id: '15',
    name: 'Skin Brightening Bar',
    category: 'Natural Skincare',
    weight: '100g',
    price: PRICE_BY_ID['15'],
    image: 'Hyper Nature Skin Brightening Bar (100g).jpg',
    inStock: true,
    group: 'Organic',
    subcategory: 'Toiletries',
  },
  {
    id: '16',
    name: 'Fenugreek Anti-Dandruff Shampoo',
    category: 'Hair Care',
    weight: '200ml',
    price: PRICE_BY_ID['16'],
    image: 'Hyper Nature Fenugreek Anti-Dandruff Shampoo.jpg',
    inStock: true,
    group: 'Organic',
    subcategory: 'Toiletries',
  },
  {
    id: '17',
    name: 'Nourishing Herbal Shampoo Bar',
    category: 'Hair Care',
    weight: '100g',
    price: PRICE_BY_ID['17'],
    image: 'Hyper Nature Nourishing Herbal Shampoo Bar.jpg',
    inStock: true,
    group: 'Organic',
    subcategory: 'Toiletries',
  },
  {
    id: '18',
    name: 'Bridal Beauty Bar',
    category: 'Natural Skincare',
    weight: '100g',
    price: PRICE_BY_ID['18'],
    image: 'Bridal Beauty Bar.jpg',
    inStock: true,
    group: 'Organic',
    subcategory: 'Toiletries',
  },
];

export const noPreservativeProducts: Product[] = [
  {
    id: '19',
    name: 'Mix Millet Fusilli',
    category: 'Millet Pasta',
    weight: '250g',
    price: PRICE_BY_ID['19'],
    image: 'Mix Millet Fusilli-Front.png',
    inStock: true,
    group: 'No-Preservative',
  },
  {
    id: '20',
    name: 'Mix Millet Macaroni',
    category: 'Millet Pasta',
    weight: '250g',
    price: PRICE_BY_ID['20'],
    image: 'Mix Millet Macaroni.png',
    inStock: true,
    group: 'No-Preservative',
  },
  {
    id: '21',
    name: 'Mix Millet Noodles',
    category: 'Millet Pasta',
    weight: '250g',
    price: PRICE_BY_ID['21'],
    image: 'Mix Millet Noodles.png',
    inStock: true,
    group: 'No-Preservative',
  },
  {
    id: '22',
    name: 'Mix Millet Penne',
    category: 'Millet Pasta',
    weight: '250g',
    price: PRICE_BY_ID['22'],
    image: 'Mix Millet Penne.png',
    inStock: true,
    group: 'No-Preservative',
  },
  {
    id: '23',
    name: 'Mix Millet Vermicelli',
    category: 'Millet Pasta',
    weight: '200g',
    price: PRICE_BY_ID['23'],
    image: 'Mix Millet Vermicelli.png',
    inStock: true,
    group: 'No-Preservative',
  },
  {
    id: '24',
    name: 'Multi Millet Cookies',
    category: 'Snacks',
    weight: '200g',
    price: PRICE_BY_ID['24'],
    image: 'Multi Millet cookies.png',
    inStock: true,
    group: 'No-Preservative',
  },
  {
    id: '25',
    name: 'Ragi Choco Cookies',
    category: 'Snacks',
    weight: '200g',
    price: PRICE_BY_ID['25'],
    image: 'Ragi-choco cookies.png',
    inStock: true,
    group: 'No-Preservative',
  },
  {
    id: '26',
    name: 'Fusilli Back',
    category: 'Millet Pasta',
    weight: '250g',
    price: PRICE_BY_ID['26'],
    image: 'Fusilli-back.png',
    inStock: true,
    group: 'No-Preservative',
  },
];

const categories = ['All', 'Organic', 'No-Preservative'];

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

    const allProducts = [...organicProducts, ...noPreservativeProducts];

    const filteredProducts = selectedCategory === 'All'
      ? allProducts
      : allProducts.filter(product => product.group === selectedCategory);

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
      <Image source={getImageSource(item.image)} style={styles.productImage} />
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
    borderRadius: 12,
    margin: 8,
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 4,
    elevation: 2,
  },
  productImage: {
    width: '100%',
    height: 70,
    backgroundColor: '#E5E7EB',
    resizeMode: 'contain',
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
    fontSize: 9,
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
