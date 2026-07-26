Enterimport React, { useState } from 'react';
import {
  StyleSheet,
  View,
  Text,
  TextInput,
  TouchableOpacity,
  ScrollView,
  Image,
  SafeAreaView,
  StatusBar,
  Linking,
  Alert,
  Dimensions,
  FlatList
} from 'react-native';
import * as ImagePicker from 'expo-image-picker';

const { width } = Dimensions.get('window');

export default function App() {
  const [activeTab, setActiveTab] = useState('home');
  const [searchQuery, setSearchQuery] = useState('');
  const [currentImageIndex, setCurrentImageIndex] = useState({});

  const [newTitle, setNewTitle] = useState('');
  const [newPrice, setNewPrice] = useState('');
  const [newPhone, setNewPhone] = useState('');
  const [newCategory, setNewCategory] = useState('شفلات');
  const [newDescription, setNewDescription] = useState('');
  const [uploadedImages, setUploadedImages] = useState([]);

  const [items, setItems] = useState([
    {
      id: '1',
      title: 'شفل كاواساكي 80ZV موديل 2011',
      price: '$25,000',
      category: 'شفلات',
      phone: '07724214967',
      images: [
        'https://images.unsplash.com/photo-1578575437130-527eed3abbec?w=500&q=80',
        'https://images.unsplash.com/photo-1504307651254-35680f356dfd?w=500&q=80'
      ]
    },
    {
      id: '2',
      title: 'حفارة بوكلين CAT 320D',
      price: '$48,000',
      category: 'حفارات',
      phone: '07724214967',
      images: [
        'https://images.unsplash.com/photo-1581094288338-2314dddb7ece?w=500&q=80',
        'https://images.unsplash.com/photo-1578575437130-527eed3abbec?w=500&q=80',
        'https://images.unsplash.com/photo-1504307651254-35680f356dfd?w=500&q=80'
      ]
    },
    {
      id: '3',
      title: 'كرين تدانو 25 طن - جاهز للعمل',
      price: '$150/يوم',
      category: 'تأجير',
      phone: '07724214967',
      images: [
        'https://images.unsplash.com/photo-1541888946425-d0fbb186a5b3?w=500&q=80'
      ]
    },
    {
      id: '4',
      title: 'مضخة هيدروليك كومبتسو أصلية',
      price: '$3,200',
      category: 'قطع غيار',
      phone: '07724214967',
      images: [
        'https://images.unsplash.com/photo-1581092160607-ee22621dd758?w=500&q=80'
      ]
    }
  ]);

  const takePhoto = async () => {
    try {
      if (uploadedImages.length >= 6) {
        Alert.alert('تنبيه', 'يمكنك إضافة حتى 6 صور فقط لكل إعلان.');
        return;
      }

      const permission = await ImagePicker.requestCameraPermissionsAsync();
      if (!permission.granted) {
        Alert.alert('الصلاحية مطلوبة', 'يرجى إعطاء صلاحية الكاميرا من إعدادات الجهاز.');
        return;
      }

      const result = await ImagePicker.launchCameraAsync({
        allowsEditing: true,
        quality: 0.7,
      });

      if (!result.canceled && result.assets && result.assets.length > 0) {
        setUploadedImages(prev => [...prev, result.assets[0].uri].slice(0, 6));
      }
    } catch (error) {
      Alert.alert('خطأ', 'تعذر فتح الكاميرا.');
    }
  };

  const pickImages = async () => {
    try {
      if (uploadedImages.length >= 6) {
        Alert.alert('تنبيه', 'يمكنك إضافة حتى 6 صور فقط لكل إعلان.');
        return;
      }

      const permission = await ImagePicker.requestMediaLibraryPermissionsAsync();
      if (!permission.granted) {
        Alert.alert('الصلاحية مطلوبة', 'يرجى إعطاء صلاحية الوصول للمعرض.');
        return;
      }

      const result = await ImagePicker.launchImageLibraryAsync({
        allowsMultipleSelection: true,
        selectionLimit: 6 - uploadedImages.length,
        quality: 0.7,
      });

      if (!result.canceled && result.assets && result.assets.length > 0) {
        const uris = result.assets.map(a => a.uri);
        setUploadedImages(prev => [...prev, ...uris].slice(0, 6));
      }
    } catch (error) {
      Alert.alert('خطأ', 'تعذر فتح المعرض.');
    }
  };

  const removeImage = (index) => {
    setUploadedImages(prev => prev.filter((_, i) => i !== index));
  };

  const openWhatsApp = (phone) => {
    const formattedPhone = phone.startsWith('0') ? '964' + phone.slice(1) : phone;
    Linking.openURL(`https://wa.me/${formattedPhone}`).catch(() => {
      Alert.alert('تواصل', `الاتصال بالرقم: ${phone}`);
    });
  };

  const handleAddListing = () => {
    if (!newTitle || !newPhone) {
      Alert.alert('تنبيه', 'يرجى إدخال عنوان الإعلان ورقم الهاتف على الأقل.');
      return;
    }

    const newItem = {
      id: Date.now().toString(),
      title: newTitle,
      price: newPrice ? `${newPrice} $` : 'حسب الاتفاق',
      category: newCategory,
      phone: newPhone,
      images: uploadedImages.length > 0 ? uploadedImages : ['https://images.unsplash.com/photo-1578575437130-527eed3abbec?w=500&q=80']
    };

    setItems([newItem, ...items]);
    setNewTitle('');
    setNewPrice('');
    setNewPhone('');
    setNewDescription('');
    setUploadedImages([]);
    setActiveTab('home');
    Alert.alert('تم بنجاح 🚀', 'تم نشر إعلانك مجاناً على منصة GAZZ!');
  };

  const ImageCarousel = ({ item }) => {
    const [activeIndex, setActiveIndex] = useState(0);

    const handleScroll = (event) => {
      const contentOffsetX = event.nativeEvent.contentOffset.x;
      const currentIndex = Math.round(contentOffsetX / (width - 30));
      setActiveIndex(currentIndex);
    };

    return (
      <View>
        <ScrollView
          horizontal
          pagingEnabled
          showsHorizontalScrollIndicator={false}
          style={styles.carousel}
          onScroll={handleScroll}
          scrollEventThrottle={16}
        >
          {item.images.map((imgUri, idx) => (
            <Image key={idx} source={{ uri: imgUri }} style={styles.cardImage} />
          ))}
        </ScrollView>

        {item.images.length > 1 && (
          <View style={styles.paginationContainer}>
            {item.images.map((_, idx) => (
              <View
                key={idx}
                style={[
                  styles.paginationDot,
                  idx === activeIndex && styles.activePaginationDot
                ]}
              />
            ))}
          </View>
        )}

        {item.images.length > 1 && (
          <View style={styles.badgeContainer}>
            <Text style={styles.imageCountBadge}>📷 {item.images.length}</Text>
          </View>
        )}
      </View>
    );
  };

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor="#121212" />

      {/* ========== HEADER WITH PROFESSIONAL LOGO ========== */}
      <View style={styles.header}>
        {/* Main Logo Image Container */}
        <View style={styles.logoContainer}>
          <Image
            source={{
              uri: 'https://raw.githubusercontent.com/majdkhudur-prog/gazz-app/main/assets/gazz-logo.png'
            }}
            style={styles.logoImage}
            onError={() => console.log('Logo image not found, using fallback emoji')}
          />
        </View>

        {/* Fallback: Text + Emoji Logo (displayed if image fails) */}
        <View style={styles.brandContainer}>
          <Text style={styles.logoEmoji}>🚜</Text>
          <Text style={styles.logoText}>GAZZ</Text>
        </View>
        <Text style={styles.subHeader}>منصة الآليات الثقيلة وقطع الغيار</Text>
      </View>

      {/* 1️⃣ HOME SCREEN */}
      {activeTab === 'home' && (
        <ScrollView style={styles.content}>
          <View style={styles.searchSection}>
            <Text style={styles.searchIcon}>🔍</Text>
            <TextInput
              style={styles.searchInput}
              placeholder="ابحث عن آليّة، قطعة غيار، صيانة..."
              placeholderTextColor="#888"
              value={searchQuery}
              onChangeText={setSearchQuery}
            />
          </View>

          <View style={styles.banner}>
            <Text style={{ fontSize: 20 }}>🏷️</Text>
            <Text style={styles.bannerText}>خصم 15% على فحص وصيانة الشفلات والحفارات هذا الأسبوع!</Text>
          </View>

          <Text style={styles.sectionTitle}>الخدمات السريعة</Text>
          <View style={styles.quickGrid}>
            <TouchableOpacity style={styles.quickCard}>
              <Text style={styles.quickEmoji}>🔧</Text>
              <Text style={styles.quickText}>قطع غيار</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.quickCard}>
              <Text style={styles.quickEmoji}>🛠️</Text>
              <Text style={styles.quickText}>صيانة</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.quickCard}>
              <Text style={styles.quickEmoji}>🚜</Text>
              <Text style={styles.quickText}>تأجير</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.quickCard}>
              <Text style={styles.quickEmoji}>🛡️</Text>
              <Text style={styles.quickText}>فحص معتمد</Text>
            </TouchableOpacity>
          </View>

          <Text style={styles.sectionTitle}>أحدث المعروضات ({items.length})</Text>
          {items.map((item) => (
            <View key={item.id} style={styles.itemCard}>
              <ImageCarousel item={item} />

              <View style={styles.itemDetails}>
                <View style={{ flex: 1, alignItems: 'flex-end' }}>
                  <Text style={styles.itemTitle}>{item.title}</Text>
                  <Text style={styles.itemCategory}>{item.category}</Text>
                  <Text style={styles.itemPrice}>{item.price}</Text>
                </View>

                <TouchableOpacity style={styles.whatsappBtn} onPress={() => openWhatsApp(item.phone)}>
                  <Text style={{ fontSize: 16 }}>💬</Text>
                  <Text style={styles.btnText}>تواصل</Text>
                </TouchableOpacity>
              </View>
            </View>
          ))}
        </ScrollView>
      )}

      {/* 2️⃣ ADD LISTING SCREEN */}
      {activeTab === 'add' && (
        <ScrollView style={styles.content}>
          <Text style={styles.formHeader}>➕ إضافة إعلان جديد - GAZZ</Text>

          <Text style={styles.label}>صور المعدة (حتى 6 صور) *</Text>
          <View style={styles.mediaRow}>
            <TouchableOpacity style={styles.mediaBtn} onPress={takePhoto}>
              <Text style={{ fontSize: 22 }}>📷</Text>
              <Text style={styles.mediaBtnText}>كاميرا</Text>
            </TouchableOpacity>

            <TouchableOpacity style={styles.mediaBtn} onPress={pickImages}>
              <Text style={{ fontSize: 22 }}>🖼️</Text>
              <Text style={styles.mediaBtnText}>معرج الصور</Text>
            </TouchableOpacity>
          </View>

          {uploadedImages.length > 0 && (
            <Text style={styles.imageCountText}>تم إضافة {uploadedImages.length} من 6 صور</Text>
          )}

          {uploadedImages.length > 0 && (
            <ScrollView horizontal style={styles.previewRow}>
              {uploadedImages.map((uri, idx) => (
                <View key={idx} style={styles.previewWrapper}>
                  <Image source={{ uri }} style={styles.previewThumb} />
                  <TouchableOpacity style={styles.deleteBadge} onPress={() => removeImage(idx)}>
                    <Text style={styles.deleteText}>✕</Text>
                  </TouchableOpacity>
                </View>
              ))}
            </ScrollView>
          )}

          <Text style={styles.label}>عنوان الإعلان *</Text>
          <TextInput
            style={styles.input}
            placeholder="مثال: شفل كاواساكي 80ZV موديل 2011"
            placeholderTextColor="#666"
            value={newTitle}
            onChangeText={setNewTitle}
          />

          <Text style={styles.label}>رقم الهاتف / واتساب *</Text>
          <TextInput
            style={styles.input}
            placeholder="07XXXXXXXXX"
            placeholderTextColor="#666"
            keyboardType="phone-pad"
            value={newPhone}
            onChangeText={setNewPhone}
          />

          <Text style={styles.label}>السعر ($) (اختياري)</Text>
          <TextInput
            style={styles.input}
            placeholder="مثال: 25,000 $"
            placeholderTextColor="#666"
            keyboardType="numeric"
            value={newPrice}
            onChangeText={setNewPrice}
          />

          <Text style={styles.label}>التفاصيل والمواصفات</Text>
          <TextInput
            style={[styles.input, styles.textArea]}
            placeholder="أدخل مواصفات الآلية والحالة العامة..."
            placeholderTextColor="#666"
            multiline
            numberOfLines={3}
            value={newDescription}
            onChangeText={setNewDescription}
          />

          <TouchableOpacity style={styles.submitBtn} onPress={handleAddListing}>
            <Text style={styles.submitBtnText}>نشر الإعلان مجاناً 🚀</Text>
          </TouchableOpacity>
        </ScrollView>
      )}

      {/* 3️⃣ ACCOUNT SCREEN */}
      {activeTab === 'account' && (
        <ScrollView style={styles.content}>
          <View style={styles.profileHeader}>
            <Text style={{ fontSize: 50 }}>👤</Text>
            <Text style={styles.profileName}>حساب GAZZ المعتمد</Text>
            <Text style={styles.profileSub}>إدارة المعروضات والدعم الفني</Text>
          </View>

          <View style={styles.accountCard}>
            <TouchableOpacity style={styles.accountRow} onPress={() => openWhatsApp('07724214967')}>
              <Text style={{ fontSize: 20 }}>💬</Text>
              <Text style={styles.accountRowText}>الدعم الفني المباشر عبر الواتساب</Text>
            </TouchableOpacity>

            <TouchableOpacity style={styles.accountRow} onPress={() => Alert.alert('GAZZ', 'تطبيق GAZZ v1.0.0 جاهز بالكامل')}>
              <Text style={{ fontSize: 20 }}>ℹ️</Text>
              <Text style={styles.accountRowText}>عن تطبيق GAZZ</Text>
            </TouchableOpacity>
          </View>
        </ScrollView>
      )}

      {/* 4️⃣ OTHER TABS */}
      {(activeTab === 'sections' || activeTab === 'myListings') && (
        <View style={styles.emptyTabContainer}>
          <Text style={{ fontSize: 40 }}>📋</Text>
          <Text style={styles.emptyTabText}>
            {activeTab === 'sections' ? 'قسم الأقسام والتصنيفات' : 'قائمة إعلاناتك النشطة'}
          </Text>
        </View>
      )}

      {/* 🔻 BOTTOM NAVIGATION BAR */}
      <View style={styles.navBar}>
        <TouchableOpacity style={styles.navItem} onPress={() => setActiveTab('home')}>
          <Text style={styles.navEmoji}>🏠</Text>
          <Text style={[styles.navText, activeTab === 'home' && styles.activeNavText]}>الرئيسية</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.navItem} onPress={() => setActiveTab('sections')}>
          <Text style={styles.navEmoji}>📑</Text>
          <Text style={[styles.navText, activeTab === 'sections' && styles.activeNavText]}>الأقسام</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.navItem} onPress={() => setActiveTab('add')}>
          <Text style={{ fontSize: 24 }}>➕</Text>
          <Text style={[styles.navText, { color: '#FF9500', fontWeight: 'bold' }]}>إضافة</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.navItem} onPress={() => setActiveTab('myListings')}>
          <Text style={styles.navEmoji}>📋</Text>
          <Text style={[styles.navText, activeTab === 'myListings' && styles.activeNavText]}>إعلاناتي</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.navItem} onPress={() => setActiveTab('account')}>
          <Text style={styles.navEmoji}>👤</Text>
          <Text style={[styles.navText, activeTab === 'account' && styles.activeNavText]}>حسابي</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#121212' },
  
  // ========== HEADER WITH LOGO STYLES ==========
  header: {
    padding: 16,
    alignItems: 'center',
    backgroundColor: '#1E1E1E',
    borderBottomWidth: 1,
    borderBottomColor: '#252525',
  },
  logoContainer: {
    width: 120,
    height: 90,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 8,
    backgroundColor: 'transparent',
  },
  logoImage: {
    width: '100%',
    height: '100%',
    resizeMode: 'contain',
  },
  brandContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  logoEmoji: { fontSize: 22 },
  logoText: { fontSize: 22, fontWeight: 'bold', color: '#FF9500' },
  subHeader: { color: '#AAA', fontSize: 11, marginTop: 6 },
  
  // ========== CONTENT STYLES ==========
  content: { flex: 1, padding: 15 },
  searchSection: {
    flexDirection: 'row-reverse',
    alignItems: 'center',
    backgroundColor: '#1E1E1E',
    borderRadius: 8,
    paddingHorizontal: 10,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: '#333'
  },
  searchIcon: { fontSize: 16, marginLeft: 8 },
  searchInput: { flex: 1, color: '#FFF', paddingVertical: 10, textAlign: 'right' },
  banner: {
    backgroundColor: '#FF9500',
    padding: 12,
    borderRadius: 8,
    flexDirection: 'row-reverse',
    alignItems: 'center',
    gap: 8,
    marginBottom: 15
  },
  bannerText: { color: '#FFF', fontWeight: 'bold', fontSize: 12, flex: 1, textAlign: 'right' },
  sectionTitle: { color: '#FFF', fontSize: 15, fontWeight: 'bold', marginBottom: 10, textAlign: 'right' },
  quickGrid: { flexDirection: 'row-reverse', justifyContent: 'space-between', marginBottom: 20 },
  quickCard: {
    backgroundColor: '#1E1E1E',
    width: '23%',
    paddingVertical: 12,
    borderRadius: 8,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#2A2A2A'
  },
  quickEmoji: { fontSize: 20 },
  quickText: { color: '#DDD', fontSize: 10, marginTop: 4, textAlign: 'center' },
  
  // ========== ITEM CARD & CAROUSEL ==========
  itemCard: {
    backgroundColor: '#1E1E1E',
    borderRadius: 10,
    overflow: 'hidden',
    marginBottom: 15,
    borderWidth: 1,
    borderColor: '#2A2A2A'
  },
  carousel: { height: 160 },
  cardImage: { width: width - 30, height: 160, resizeMode: 'cover' },
  paginationContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 8,
    backgroundColor: 'rgba(0,0,0,0.3)'
  },
  paginationDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: '#888',
    marginHorizontal: 4
  },
  activePaginationDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: '#FF9500'
  },
  badgeContainer: { position: 'absolute', top: 10, right: 10 },
  imageCountBadge: {
    backgroundColor: 'rgba(0,0,0,0.7)',
    color: '#FFF',
    fontSize: 10,
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 10
  },
  itemDetails: { padding: 12, flexDirection: 'row-reverse', justifyContent: 'space-between', alignItems: 'center' },
  itemTitle: { color: '#FFF', fontSize: 14, fontWeight: 'bold' },
  itemCategory: { color: '#888', fontSize: 11, marginTop: 2 },
  itemPrice: { color: '#FF9500', fontSize: 13, fontWeight: 'bold', marginTop: 4 },
  whatsappBtn: {
    backgroundColor: '#25D366',
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 6,
    gap: 4
  },
  btnText: { color: '#FFF', fontWeight: 'bold', fontSize: 12 },
  
  // ========== FORM STYLES ==========
  formHeader: { color: '#FF9500', fontSize: 18, fontWeight: 'bold', textAlign: 'center', marginBottom: 15 },
  label: { color: '#DDD', fontSize: 13, marginTop: 10, marginBottom: 5, textAlign: 'right' },
  mediaRow: { flexDirection: 'row-reverse', justifyContent: 'space-between', marginBottom: 10 },
  mediaBtn: {
    flex: 0.48,
    backgroundColor: '#1E1E1E',
    borderWidth: 1,
    borderColor: '#FF9500',
    padding: 10,
    borderRadius: 8,
    alignItems: 'center',
    flexDirection: 'row-reverse',
    justifyContent: 'center',
    gap: 8
  },
  mediaBtnText: { color: '#FFF', fontWeight: 'bold', fontSize: 13 },
  imageCountText: { color: '#FF9500', fontSize: 12, textAlign: 'center', marginBottom: 8, fontWeight: 'bold' },
  previewRow: { flexDirection: 'row-reverse', marginVertical: 8 },
  previewWrapper: { position: 'relative', marginLeft: 8 },
  previewThumb: { width: 60, height: 60, borderRadius: 6 },
  deleteBadge: {
    position: 'absolute',
    top: -5,
    left: -5,
    backgroundColor: '#FF3B30',
    borderRadius: 10,
    width: 18,
    height: 18,
    alignItems: 'center',
    justifyContent: 'center'
  },
  deleteText: { color: '#FFF', fontSize: 10, fontWeight: 'bold' },
  input: {
    backgroundColor: '#1E1E1E',
    color: '#FFF',
    padding: 12,
    borderRadius: 8,
    textAlign: 'right',
    borderWidth: 1,
    borderColor: '#333'
  },
  textArea: { height: 70, textAlignVertical: 'top' },
  submitBtn: { backgroundColor: '#FF9500', padding: 14, borderRadius: 8, alignItems: 'center', marginTop: 20, marginBottom: 20 },
  submitBtnText: { color: '#FFF', fontWeight: 'bold', fontSize: 15 },
  
  // ========== PROFILE STYLES ==========
  profileHeader: { alignItems: 'center', marginVertical: 20 },
  profileName: { color: '#FFF', fontSize: 18, fontWeight: 'bold', marginTop: 10 },
  profileSub: { color: '#888', fontSize: 12, marginTop: 4 },
  accountCard: { backgroundColor: '#1E1E1E', borderRadius: 8, padding: 10, borderWidth: 1, borderColor: '#2A2A2A' },
  accountRow: { flexDirection: 'row-reverse', alignItems: 'center', padding: 12, gap: 10, borderBottomWidth: 1, borderBottomColor: '#282828' },
  accountRowText: { color: '#DDD', fontSize: 14 },
  emptyTabContainer: { flex: 1, justifyContent: 'center', alignItems: 'center', marginTop: 80 },
  emptyTabText: { color: '#888', fontSize: 14, marginTop: 10 },
  
  // ========== BOTTOM NAVIGATION STYLES ==========
  navBar: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
    backgroundColor: '#1E1E1E',
    paddingVertical: 8,
    borderTopWidth: 1,
    borderTopColor: '#252525'
  },
  navItem: { alignItems: 'center' },
  navEmoji: { fontSize: 18 },
  navText: { color: '#888', fontSize: 10, marginTop: 2 },
  activeNavText: { color: '#FF9500', fontWeight: 'bold' }
});
