import { View, StyleSheet, Text, TouchableOpacity } from 'react-native';
import React, { memo, useEffect, useState, useCallback } from 'react';
import MapView, { Marker, PROVIDER_GOOGLE, MapViewProps } from 'react-native-maps';
import * as Location from 'expo-location';
import { ListingGeo } from '@/interfaces/listingGeo';
import { useRouter } from 'expo-router';
import MapViewClustering from 'react-native-map-clustering';
import { Colors } from 'react-native/Libraries/NewAppScreen';
import { Ionicons } from '@expo/vector-icons';
import FontAwesome from '@expo/vector-icons/FontAwesome';

interface ListingsMapProps {
  listings: {
    features: ListingGeo[];
  };
}

const INITIAL_REGION = {
  latitude: 52.52, // Default latitude (Berlin)
  longitude: 13.405, // Default longitude (Berlin)
  latitudeDelta: 0.1, // Adjust for zoom level
  longitudeDelta: 0.1,
};

const ListingsMap = memo(({ listings }: ListingsMapProps) => {
  const [hasLocationPermission, setHasLocationPermission] = useState(false);
  const [userLocation, setUserLocation] = useState<{
    latitude: number;
    longitude: number;
  } | null>(null);
  const router = useRouter();
  const mapRef = React.useRef<MapView | null>(null);

  const onMarkerSelected = (item: ListingGeo) => {
    router.push(`/listing/${item.properties.id}`);
  };

  const goToUserLocation = () => {
    if (userLocation && mapRef.current) {
      mapRef.current.animateToRegion({
        latitude: userLocation.latitude,
        longitude: userLocation.longitude,
        latitudeDelta: 0.01,
        longitudeDelta: 0.01,
      });
    }
  };

  useEffect(() => {
    const requestLocationPermission = async () => {
      try {
        const { status } = await Location.requestForegroundPermissionsAsync();
        if (status === 'granted') {
          setHasLocationPermission(true);
          const location = await Location.getCurrentPositionAsync();
          setUserLocation({
            latitude: location.coords.latitude,
            longitude: location.coords.longitude,
          });
        } else {
          setHasLocationPermission(false);
        }
      } catch (error) {
        console.error('Error fetching location:', error);
      }
    };

    requestLocationPermission();
  }, []);

  const renderCluster = useCallback(
    (cluster: any) => {
      const { id, geometry, onPress, properties } = cluster;
      const points = properties.point_count || 0;

      return (
        <Marker
          key={`cluster-${id}`}
          onPress={onPress}
          coordinate={{
            longitude: geometry.coordinates[0],
            latitude: geometry.coordinates[1],
          }}
        >
          <View style={styles.clusterMarker}>
            <Text style={styles.clusterText}>{points}</Text>
          </View>
        </Marker>
      );
    },
    [] // Dependencies are empty since renderCluster doesn't depend on props/state
  );

  return (
    <View style={styles.container}>
      <MapViewClustering
        ref={mapRef}
        style={StyleSheet.absoluteFillObject}
        provider={PROVIDER_GOOGLE}
        showsUserLocation={hasLocationPermission}
        showsMyLocationButton={false} // Disable default button
        initialRegion={
          userLocation
            ? {
                latitude: userLocation.latitude,
                longitude: userLocation.longitude,
                latitudeDelta: 0.1,
                longitudeDelta: 0.1,
              }
            : INITIAL_REGION
        }
        clusterColor={""}
        renderCluster={renderCluster}
      >
        {listings.features.map((item: ListingGeo) => (
          <Marker
            key={item.properties.id}
            onPress={() => onMarkerSelected(item)}
            coordinate={{
              latitude: parseFloat(item.properties.latitude),
              longitude: parseFloat(item.properties.longitude),
            }}
            title={item.properties.name}
            description={item.properties.summary ?? undefined}
          />
        ))}
      </MapViewClustering>
      <TouchableOpacity style={styles.change} onPress={goToUserLocation}>
      <Ionicons name="swap-horizontal" size={24} color="#000" />
      </TouchableOpacity>
      {/* Custom Location Button */}
      <TouchableOpacity style={styles.locationButton} onPress={goToUserLocation}>
      <FontAwesome name="location-arrow" size={24} color="#000" />
      </TouchableOpacity>
    </View>
  );
});

const styles = StyleSheet.create({
  container: {
    flex: 1,
    bottom: 50,
  },
  clusterMarker: {
    borderRadius: 20,
    backgroundColor: Colors.primary,
    justifyContent: 'center',
    alignItems: 'center',
    width: 40,
    height: 40,
  },
  clusterText: {
    color: '#fff',
    textAlign: 'center',
    fontWeight: 'bold',
  },
  locationButton: {
    position: 'absolute',
    bottom: 40,
    right: 10,
    backgroundColor: '#90c9fb',
    borderRadius: 25,
    width: 40,
    height: 40,
    justifyContent: 'center',
    alignItems: 'center',
    elevation: 5, // For Android shadow
    shadowColor: '#000', // For iOS shadow
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 3,
  },
  change:{
    position: 'absolute',
    bottom: 100,
    right: 10,
    backgroundColor: '#f9f9f9',
    borderRadius: 25,
    borderColor: '#b0d9fc',
    borderWidth: 2,
    width: 40,
    height: 40,
    justifyContent: 'center',
    alignItems: 'center',
    elevation: 5, // For Android shadow
    shadowColor: '#000', // For iOS shadow
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 3,
  }
});

export default ListingsMap;
