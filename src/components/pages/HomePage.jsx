import { useState, useEffect } from 'react';
import LoadingSkeleton from '@/components/organisms/LoadingSkeleton';
import HeroSection from '@/components/organisms/HeroSection';
import FeaturedMangaSection from '@/components/organisms/FeaturedMangaSection';
import GenreGrid from '@/components/organisms/GenreGrid';
import NewReleasesSection from '@/components/organisms/NewReleasesSection';
import CallToActionSection from '@/components/organisms/CallToActionSection';
import { mangaService } from '@/services';

const HomePage = () => {
  const [featuredManga, setFeaturedManga] = useState([]);
  const [newReleases, setNewReleases] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadData = async () => {
      try {
        const allManga = await mangaService.getAll();
        
        setFeaturedManga(allManga.slice(0, 4));
        
        const sorted = [...allManga].sort((a, b) => 
          new Date(b.releaseDate) - new Date(a.releaseDate)
        );
        setNewReleases(sorted.slice(0, 6));
      } catch (error) {
        console.error('Failed to load data:', error);
      } finally {
        setLoading(false);
      }
    };

    loadData();
  }, []);

  const genres = [
    { name: 'Shonen', icon: 'Zap', count: '150+' },
    { name: 'Seinen', icon: 'Target', count: '120+' },
    { name: 'Shojo', icon: 'Heart', count: '80+' },
    { name: 'Josei', icon: 'Flower', count: '60+' },
    { name: 'Action', icon: 'Sword', count: '200+' },
    { name: 'Romance', icon: 'HeartHandshake', count: '90+' }
  ];

  if (loading) {
    return (
      <div className="min-h-screen">
        <LoadingSkeleton type="homeHero" />
        <div className="max-w-7xl mx-auto px-4 py-12">
          <LoadingSkeleton type="cardGrid" count={4} />
          <LoadingSkeleton type="cardGrid" count={6} />
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen">
      <HeroSection />
      <FeaturedMangaSection manga={featuredManga} />
      <GenreGrid genres={genres} />
      <NewReleasesSection manga={newReleases} />
      <CallToActionSection />
    </div>
  );
};

export default HomePage;