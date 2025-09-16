import React, { useState, useEffect } from 'react';
import { 
  Calendar,
  MapPin,
  Clock,
  Users,
  Star,
  Heart,
  Share2,
  QrCode,
  Camera,
  CheckCircle,
  X,
  Filter,
  Search,
  Plus,
  ChevronRight,
  ChevronLeft,
  Globe,
  Coffee,
  Utensils,
  Music,
  Gamepad2,
  BookOpen,
  Zap,
  Award,
  TrendingUp,
  Bell,
  ExternalLink,
  Download,
  Phone,
  Mail,
  MessageCircle
} from 'lucide-react';

const EventsModule = () => {
  const [activeTab, setActiveTab] = useState('upcoming');
  const [searchQuery, setSearchQuery] = useState('');
  const [filterType, setFilterType] = useState('all');
  const [filterLocation, setFilterLocation] = useState('all');
  const [showQRScanner, setShowQRScanner] = useState(false);
  const [selectedEvent, setSelectedEvent] = useState(null);
  const [events, setEvents] = useState([]);
  const [rsvps, setRsvps] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState({});
  const [showSuccessMessage, setShowSuccessMessage] = useState(false);
  const [successMessage, setSuccessMessage] = useState('');

  const eventTypes = ['all', 'Pitch Night', 'Retreat', 'Dinner', 'Workshop', 'Networking', 'Conference'];
  const locations = ['all', 'San Francisco', 'New York', 'Los Angeles', 'Austin', 'Seattle', 'Online'];

  // Load events data on component mount
  useEffect(() => {
    loadEventsData();
  }, []);

  const loadEventsData = async () => {
    setIsLoading(true);
    try {
      // Simulate API calls
      const [eventsData, rsvpsData] = await Promise.all([
        loadEvents(),
        loadRSVPs()
      ]);
      
      setEvents(eventsData);
      setRsvps(rsvpsData);
    } catch (error) {
      console.error('Error loading events data:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const loadEvents = async () => {
    await new Promise(resolve => setTimeout(resolve, 1000));
    return [
      {
        id: 1,
        title: "Pitch Night SF",
        type: "Pitch Night",
        date: "2024-01-25",
        time: "7:00 PM",
        location: "San Francisco",
        address: "123 Startup Street, SF, CA",
        price: "$25",
        capacity: 100,
        attendees: 67,
        description: "Monthly pitch night featuring 5 startups presenting to investors and entrepreneurs.",
        organizer: "SF Startup Community",
        image: "https://images.unsplash.com/photo-1511578314322-379afb476865?w=400&h=300&fit=crop",
        tags: ["Pitching", "Networking", "Investors"],
        isRSVPed: false,
        qrCode: "EVENT_001_PITCH_NIGHT_SF"
      },
      {
        id: 2,
        title: "Founder Retreat",
        type: "Retreat",
        date: "2024-02-15",
        time: "9:00 AM",
        location: "Napa Valley",
        address: "456 Vineyard Road, Napa, CA",
        price: "$299",
        capacity: 50,
        attendees: 23,
        description: "3-day retreat for founders to connect, learn, and recharge in beautiful Napa Valley.",
        organizer: "BiggDate Community",
        image: "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=400&h=300&fit=crop",
        tags: ["Retreat", "Networking", "Wellness"],
        isRSVPed: true,
        qrCode: "EVENT_002_FOUNDER_RETREAT"
      },
      {
        id: 3,
        title: "Tech Dinner Series",
        type: "Dinner",
        date: "2024-01-30",
        time: "6:30 PM",
        location: "San Francisco",
        address: "789 Tech Avenue, SF, CA",
        price: "$45",
        capacity: 30,
        attendees: 18,
        description: "Intimate dinner with 30 tech leaders discussing the future of AI and sustainability.",
        organizer: "Tech Leaders Circle",
        image: "https://images.unsplash.com/photo-1414235077428-338989a2e8c0?w=400&h=300&fit=crop",
        tags: ["Dinner", "AI", "Sustainability"],
        isRSVPed: false,
        qrCode: "EVENT_003_TECH_DINNER"
      },
      {
        id: 4,
        title: "Startup Workshop",
        type: "Workshop",
        date: "2024-02-05",
        time: "10:00 AM",
        location: "Online",
        address: "Virtual Event",
        price: "Free",
        capacity: 200,
        attendees: 156,
        description: "Learn how to build and scale your startup with expert mentors and successful founders.",
        organizer: "Startup Academy",
        image: "https://images.unsplash.com/photo-1522202176988-66273c2fd55f?w=400&h=300&fit=crop",
        tags: ["Workshop", "Learning", "Mentorship"],
        isRSVPed: true,
        qrCode: "EVENT_004_STARTUP_WORKSHOP"
      }
    ];
  };

  const loadRSVPs = async () => {
    await new Promise(resolve => setTimeout(resolve, 500));
    return [2, 4]; // Event IDs that user has RSVPed to
  };

  const handleRSVP = async (eventId) => {
    setActionLoading(prev => ({ ...prev, [eventId]: true }));
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 800));
      
      // Update RSVP status
      const isCurrentlyRSVPed = rsvps.includes(eventId);
      if (isCurrentlyRSVPed) {
        setRsvps(prev => prev.filter(id => id !== eventId));
        setSuccessMessage('RSVP cancelled successfully!');
      } else {
        setRsvps(prev => [...prev, eventId]);
        setSuccessMessage('RSVP confirmed! See you at the event.');
      }
      
      // Update event RSVP status
      setEvents(prev => 
        prev.map(event => 
          event.id === eventId 
            ? { ...event, isRSVPed: !isCurrentlyRSVPed }
            : event
        )
      );
      
      setShowSuccessMessage(true);
      setTimeout(() => setShowSuccessMessage(false), 3000);
      
    } catch (error) {
      console.error('Error updating RSVP:', error);
    } finally {
      setActionLoading(prev => ({ ...prev, [eventId]: false }));
    }
  };

  const handleQRScan = async (eventId) => {
    setActionLoading(prev => ({ ...prev, [eventId]: true }));
    try {
      // Simulate QR scan
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      setSuccessMessage('Check-in successful! Welcome to the event.');
      setShowSuccessMessage(true);
      setTimeout(() => setShowSuccessMessage(false), 3000);
      
    } catch (error) {
      console.error('Error scanning QR code:', error);
    } finally {
      setActionLoading(prev => ({ ...prev, [eventId]: false }));
    }
  };

  const handleShareEvent = async (eventId) => {
    try {
      const event = events.find(e => e.id === eventId);
      if (navigator.share) {
        await navigator.share({
          title: event.title,
          text: event.description,
          url: window.location.href
        });
      } else {
        // Fallback to copying to clipboard
        await navigator.clipboard.writeText(`${event.title} - ${event.description}`);
        setSuccessMessage('Event link copied to clipboard!');
        setShowSuccessMessage(true);
        setTimeout(() => setShowSuccessMessage(false), 3000);
      }
    } catch (error) {
      console.error('Error sharing event:', error);
    }
  };

  // Filter events based on search and filters
  const filteredEvents = events.filter(event => {
    const matchesSearch = event.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         event.description.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesType = filterType === 'all' || event.type === filterType;
    const matchesLocation = filterLocation === 'all' || event.location === filterLocation;
    
    return matchesSearch && matchesType && matchesLocation;
  });

  // Separate events by tab
  const upcomingEvents = filteredEvents.filter(event => new Date(event.date) >= new Date());
  const pastEvents = filteredEvents.filter(event => new Date(event.date) < new Date());
  const myEvents = filteredEvents.filter(event => rsvps.includes(event.id));

  const handleBookmark = (eventId) => {
    console.log('Bookmarking event:', eventId);
    // Bookmark logic
  };

  const handleQRCheckIn = (eventId) => {
    console.log('QR Check-in for event:', eventId);
    setShowQRScanner(true);
  };

  const renderEventCard = (event) => (
    <div key={event.id} className="bg-white rounded-3xl shadow-lg border border-gray-100 overflow-hidden hover:shadow-xl transition-all duration-300">
      <div className="relative">
        <img
          src={event.image}
          alt={event.title}
          className="w-full h-48 object-cover"
        />
        <div className="absolute top-4 right-4 flex gap-2">
          <button
            onClick={() => handleBookmark(event.id)}
            className={`p-2 rounded-xl transition-colors ${
              event.isBookmarked 
                ? 'text-yellow-500 bg-yellow-50' 
                : 'text-white bg-black bg-opacity-30 hover:bg-opacity-50'
            }`}
          >
            <Heart className={`w-5 h-5 ${event.isBookmarked ? 'fill-current' : ''}`} />
          </button>
          <button
            onClick={() => handleShareEvent(event.id)}
            className="p-2 text-white bg-black bg-opacity-30 hover:bg-opacity-50 rounded-xl transition-colors"
          >
            <Share2 className="w-5 h-5" />
          </button>
        </div>
        <div className="absolute top-4 left-4">
          <span className="px-3 py-1 bg-white bg-opacity-90 text-gray-800 text-sm font-semibold rounded-xl">
            {event.type}
          </span>
        </div>
      </div>
      
      <div className="p-6">
        <div className="flex items-start justify-between mb-4">
          <div className="flex-1">
            <h3 className="text-xl font-bold text-gray-900 mb-2">{event.title}</h3>
            <p className="text-gray-600 text-sm mb-3 line-clamp-2">{event.description}</p>
          </div>
        </div>
        
        <div className="space-y-3 mb-6">
          <div className="flex items-center gap-2 text-gray-600">
            <Calendar className="w-4 h-4" />
            <span className="text-sm">{event.date} at {event.time}</span>
          </div>
          <div className="flex items-center gap-2 text-gray-600">
            <MapPin className="w-4 h-4" />
            <span className="text-sm">{event.location}</span>
          </div>
          <div className="flex items-center gap-2 text-gray-600">
            <Users className="w-4 h-4" />
            <span className="text-sm">{event.attendees}/{event.capacity} attendees</span>
          </div>
          <div className="flex items-center gap-2 text-gray-600">
            <span className="text-sm font-semibold text-green-600">{event.price}</span>
          </div>
        </div>
        
        <div className="flex items-center gap-2 mb-4">
          {event.tags.map((tag, index) => (
            <span
              key={index}
              className="px-2 py-1 bg-gray-100 text-gray-700 text-xs rounded-lg"
            >
              {tag}
            </span>
          ))}
        </div>
        
        <div className="flex items-center gap-3">
          {event.isRSVPed ? (
            <div className="flex items-center gap-2 text-green-600">
              <CheckCircle className="w-5 h-5" />
              <span className="font-semibold">RSVPed</span>
            </div>
          ) : (
            <button
              onClick={() => handleRSVP(event.id)}
              disabled={actionLoading[event.id]}
              className="flex-1 px-4 py-3 bg-gradient-to-r from-purple-500 to-pink-500 text-white rounded-xl hover:from-purple-600 hover:to-pink-600 transition-all duration-300 font-semibold disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {actionLoading[event.id] ? (
                <div className="flex items-center justify-center gap-2">
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                  {event.isRSVPed ? 'Cancelling...' : 'RSVPing...'}
                </div>
              ) : (
                event.isRSVPed ? 'Cancel RSVP' : 'RSVP Now'
              )}
            </button>
          )}
          
          {event.isRSVPed && (
            <button
              onClick={() => handleQRScan(event.id)}
              disabled={actionLoading[event.id]}
              className="px-4 py-3 bg-gradient-to-r from-blue-500 to-cyan-500 text-white rounded-xl hover:from-blue-600 hover:to-cyan-600 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {actionLoading[event.id] ? (
                <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
              ) : (
                <QrCode className="w-5 h-5" />
              )}
            </button>
          )}
        </div>
      </div>
    </div>
  );

  // Show loading state
  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-white flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-green-600 mx-auto mb-4"></div>
          <p className="text-gray-600 font-medium text-lg">Loading events...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-white">
      {/* Success Message */}
      {showSuccessMessage && (
        <div className="fixed top-4 right-4 z-50 bg-green-500 text-white px-6 py-3 rounded-xl shadow-lg animate-slide-in">
          <div className="flex items-center gap-2">
            <CheckCircle className="w-5 h-5" />
            <span>{successMessage}</span>
          </div>
        </div>
      )}

      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Events</h1>
            <p className="text-gray-600">IRL Pitch Nights, Retreats, Dinners</p>
          </div>
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2 bg-gradient-to-r from-green-50 to-emerald-50 px-4 py-2 rounded-2xl">
              <Calendar className="w-5 h-5 text-green-600" />
              <span className="font-semibold text-green-700">{myEvents.length} RSVPed</span>
            </div>
            <button className="flex items-center gap-2 bg-gradient-to-r from-green-500 to-emerald-500 text-white px-4 py-2 rounded-2xl hover:from-green-600 hover:to-emerald-600 transition-all duration-300">
              <Plus className="w-5 h-5" />
              Create Event
            </button>
          </div>
        </div>

        {/* Tab Navigation */}
        <div className="flex justify-center mb-8">
          <div className="bg-white rounded-2xl p-1.5 shadow-lg border border-gray-100">
            {[
              { id: 'upcoming', label: 'Upcoming', count: upcomingEvents.length },
              { id: 'my-events', label: 'My Events', count: myEvents.length },
              { id: 'past', label: 'Past Events', count: pastEvents.length }
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`px-6 py-3 rounded-xl font-semibold text-sm transition-all duration-300 ${
                  activeTab === tab.id
                    ? 'bg-gradient-to-r from-green-500 to-emerald-500 text-white shadow-lg'
                    : 'text-gray-600 hover:text-gray-900 hover:bg-gray-50'
                }`}
              >
                {tab.label} ({tab.count})
              </button>
            ))}
          </div>
        </div>

        {/* Search and Filters */}
        <div className="flex flex-col md:flex-row gap-4 mb-8">
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
            <input
              type="text"
              placeholder="Search events..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-3 border border-gray-200 rounded-2xl focus:ring-2 focus:ring-green-500 focus:border-transparent"
            />
          </div>
          <select
            value={filterType}
            onChange={(e) => setFilterType(e.target.value)}
            className="px-4 py-3 border border-gray-200 rounded-2xl focus:ring-2 focus:ring-green-500 focus:border-transparent"
          >
            {eventTypes.map((type) => (
              <option key={type} value={type}>
                {type === 'all' ? 'All Types' : type}
              </option>
            ))}
          </select>
          <select
            value={filterLocation}
            onChange={(e) => setFilterLocation(e.target.value)}
            className="px-4 py-3 border border-gray-200 rounded-2xl focus:ring-2 focus:ring-green-500 focus:border-transparent"
          >
            {locations.map((location) => (
              <option key={location} value={location}>
                {location === 'all' ? 'All Locations' : location}
              </option>
            ))}
          </select>
        </div>

        {/* Events Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {activeTab === 'upcoming' && upcomingEvents.map(renderEventCard)}
          {activeTab === 'my-events' && myEvents.map(renderEventCard)}
          {activeTab === 'past' && pastEvents.map(renderEventCard)}
        </div>

        {/* Empty State */}
        {((activeTab === 'upcoming' && upcomingEvents.length === 0) ||
          (activeTab === 'my-events' && myEvents.length === 0) ||
          (activeTab === 'past' && pastEvents.length === 0)) && (
          <div className="text-center py-12">
            <Calendar className="w-16 h-16 text-gray-400 mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-gray-900 mb-2">No Events Found</h3>
            <p className="text-gray-600 mb-6">
              {activeTab === 'upcoming' && "No upcoming events match your criteria."}
              {activeTab === 'my-events' && "You haven't RSVPed to any events yet."}
              {activeTab === 'past' && "No past events to display."}
            </p>
            <button className="px-6 py-3 bg-gradient-to-r from-green-500 to-emerald-500 text-white rounded-xl hover:from-green-600 hover:to-emerald-600 transition-all duration-300">
              Browse All Events
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default EventsModule;