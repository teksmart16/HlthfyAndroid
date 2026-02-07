import React from 'react';
import { View, Text, FlatList, Image, TouchableOpacity, StyleSheet, Alert } from 'react-native';
import { Product } from '../types';
import { organicProducts } from './HomeScreen';
import { getImageSource } from '../utils/imageMap';

interface Props {
  onAddToCart: (product: Product) => void;
}

const GroceriesScreen: React.FC<Props> = ({ onAddToCart }) => {
  const products = organicProducts.filter(p => p.subcategory === 'Groceries');

  const handleAddToCart = (product: Product) => {
    if (!product.inStock) return Alert.alert('Out of Stock', `${product.name} is out of stock.`);
    onAddToCart(product);
    Alert.alert('Added to Cart', `${product.name} added to cart`);
  };

  const renderItem = ({ item }: { item: Product }) => (
    <View style={styles.card}>
      <Image source={getImageSource(item.image)} style={styles.image} />
      <View style={styles.info}>
        <Text style={styles.name}>{item.name}</Text>
        <Text style={styles.price}>₹{item.price}</Text>
        <TouchableOpacity style={styles.button} onPress={() => handleAddToCart(item)}>
          <Text style={styles.buttonText}>Add</Text>
        </TouchableOpacity>
      </View>
    </View>
  );

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Organic — Groceries</Text>
      <FlatList data={products} renderItem={renderItem} keyExtractor={i => i.id} />
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, padding: 12, backgroundColor: '#fff' },
  title: { fontSize: 20, fontWeight: 'bold', marginBottom: 12 },
  card: { flexDirection: 'row', marginBottom: 12, borderRadius: 8, overflow: 'hidden', borderWidth: 1, borderColor: '#eee' },
  image: { width: 100, height: 100, resizeMode: 'cover' },
  info: { flex: 1, padding: 8, justifyContent: 'center' },
  name: { fontSize: 16, fontWeight: '600' },
  price: { marginTop: 6, fontSize: 14, color: '#333' },
  button: { marginTop: 8, backgroundColor: '#059669', paddingVertical: 8, paddingHorizontal: 12, borderRadius: 6, alignSelf: 'flex-start' },
  buttonText: { color: 'white', fontWeight: '600' },
});

export default GroceriesScreen;
