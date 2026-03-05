import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { useLanguage } from './i18n/LanguageContext';
import { api, User, ParentRequest } from './services/api';
import {
  MessageCircle,
  ChevronRight,
  ChevronLeft,
  User as UserIcon,
  MapPin,
  Baby,
  Phone,
  Mail,
  AlertCircle,
  Clock,
  Trash2,
  Euro,
  Info,
  ShieldCheck,
  Languages,
  FileText,
  ArrowLeft,
  Star,
  Award,
  Calendar,
  Plus,
  Video,
  ExternalLink,
  Heart,
  Check,
  X,
  CalendarDays,
  CreditCard,
  Receipt,
  Calculator,
  Wallet,
  Lock,
  HelpCircle,
  Filter,
} from 'lucide-react';

import { ProfilePage } from './components/ProfilePage';
import { LoginScreen } from './components/LoginScreen';
import { AdminDashboard } from './components/AdminDashboard';

const HOURLY_RATE = 28.50;

interface TimeSlot {
  id: string;
  dbId?: number;
  startTime: string;
  endTime: string;
}

interface DateSchedule {
  id: string; // YYYY-MM-DD
  date: Date;
  slots: TimeSlot[];
  dbId?: number;
}

interface Babysitter {
  id: number;
  key: string;
  name: string;
  lastName?: string;
  age: number;
  languages: string[];
  experience: number;
  description: string;
  fullBio: string;
  photo: string;
  status: 'Online' | 'Available';
  rating: number;
  reviews: number;
  email?: string;
  phone?: string;
  address?: string;
}

interface FormData {
  firstName: string;
  lastName: string;
  address: string;
  numChildren: number;
  childDOBs: string[];
  countryCode: string;
  telephone: string;
  email: string;
}

const COUNTRY_CODES = [
  { code: '+1', country: 'United States', flag: '🇺🇸', iso: 'US' },
  { code: '+44', country: 'United Kingdom', flag: '🇬🇧', iso: 'GB' },
  { code: '+61', country: 'Australia', flag: '🇦🇺', iso: 'AU' },
  { code: '+33', country: 'France', flag: '🇫🇷', iso: 'FR' },
  { code: '+49', country: 'Germany', flag: '🇩🇪', iso: 'DE' },
  { code: '+91', country: 'India', flag: '🇮🇳', iso: 'IN' },
  { code: '+81', country: 'Japan', flag: '🇯🇵', iso: 'JP' },
  { code: '+971', country: 'United Arab Emirates', flag: '🇦🇪', iso: 'AE' },
  { code: '+34', country: 'Spain', flag: '🇪🇸', iso: 'ES' },
  { code: '+39', country: 'Italy', flag: '🇮🇹', iso: 'IT' },
  { code: '+55', country: 'Brazil', flag: '🇧🇷', iso: 'BR' },
  { code: '+27', country: 'South Africa', flag: '🇿🇦', iso: 'ZA' },
];

const Tooltip = ({ children, content }: { children: React.ReactNode, content: React.ReactNode }) => {
  const [isVisible, setIsVisible] = useState(false);

  return (
    <div className="relative inline-block" onMouseEnter={() => setIsVisible(true)} onMouseLeave={() => setIsVisible(false)}>
      {children}
      <AnimatePresence>
        {isVisible && (
          <motion.div
            initial={{ opacity: 0, y: 10, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 10, scale: 0.95 }}
            className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 w-64 p-4 bg-slate-900 text-white text-[11px] rounded-2xl shadow-2xl z-[100] pointer-events-none"
          >
            <div className="relative z-10">
              {content}
            </div>
            <div className="absolute top-full left-1/2 -translate-x-1/2 border-8 border-transparent border-t-slate-900" />
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

const CMG_FIXED_UNDER_3 = 848.47;
const CMG_FIXED_3_6 = 424.24;
const CMG_CEILING_UNDER_3 = 805.92;
const CMG_CEILING_3_PLUS = 402.50;

const calculateAge = (dob: string) => {
  if (!dob) return null;
  const birthDate = new Date(dob);
  if (isNaN(birthDate.getTime())) return null;
  const today = new Date();
  let years = today.getFullYear() - birthDate.getFullYear();
  let months = today.getMonth() - birthDate.getMonth();

  if (months < 0 || (months === 0 && today.getDate() < birthDate.getDate())) {
    years--;
    months += 12;
  }

  if (today.getDate() < birthDate.getDate()) {
    months--;
  }

  if (months < 0) {
    months += 12;
  }

  return { years, months };
};

interface FormErrors {
  [key: string]: string;
}

export default function App() {
  const { t, language, setLanguage, formatCurrency, formatNumber } = useLanguage();
  const [externalSitters, setExternalSitters] = useState<Babysitter[]>([]);
  const [sitterPage, setSitterPage] = useState(1);
  const [hasMoreSitters, setHasMoreSitters] = useState(true);
  const [isFetchingSitters, setIsFetchingSitters] = useState(false);
  const [filters, setFilters] = useState({
    language: [] as string[],
    age_group: [] as string[],
    experience: '' as string,
  });

  const formatAge = (age: { years: number, months: number } | null) => {
    if (!age) return '';
    const { years, months } = age;

    if (years === 0) {
      return `${months} ${language === 'fr' ? 'mois' : `month${months > 1 ? 's' : ''}`}`;
    }

    if (months === 0) {
      return `${years} ${language === 'fr' ? (years > 1 ? 'ans' : 'an') : `year${years > 1 ? 's' : ''}`}`;
    }

    return `${years}y ${months}m`;
  };

  const localizedSitters = React.useMemo(() => {
    return externalSitters.map(sitter => ({
      ...sitter,
      description: (t.sitters as any)[sitter.key]?.description || sitter.description,
      fullBio: (t.sitters as any)[sitter.key]?.fullBio || sitter.fullBio,
    }));
  }, [t.sitters, externalSitters]);

  const [currentStep, setCurrentStep] = useState(1);
  const [view, setView] = useState<'booking' | 'profile' | 'login' | 'admin-dashboard'>('booking');
  const [formData, setFormData] = useState<FormData>({
    firstName: '',
    lastName: '',
    address: '',
    numChildren: 1,
    childDOBs: [''],
    countryCode: '+1',
    telephone: '',
    email: '',
  });

  const [dateSchedule, setDateSchedule] = useState<DateSchedule[]>([]);
  const [calendarViewDate, setCalendarViewDate] = useState(new Date());
  const [timeSelectionDate, setTimeSelectionDate] = useState<Date | null>(null);
  const [tempTimeConfig, setTempTimeConfig] = useState({ startTime: '', endTime: '' });

  const [errors, setErrors] = useState<FormErrors>({});
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [isCountryDropdownOpen, setIsCountryDropdownOpen] = useState(false);
  const [countrySearch, setCountrySearch] = useState('');
  const [isPaymentModalOpen, setIsPaymentModalOpen] = useState(false);
  const [isPaymentProcessing, setIsPaymentProcessing] = useState(false);
  const [isPaymentSuccess, setIsPaymentSuccess] = useState(false);

  const [isRegistering, setIsRegistering] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [parentRequestId, setParentRequestId] = useState<number | null>(null);
  const [isModifying, setIsModifying] = useState(false);
  const [user, setUser] = useState<User | null>(null);

  useEffect(() => {
    const checkAuth = async () => {
      const token = api.getToken();
      if (token) {
        try {
          const response = await api.getUser();
          if (response.status && response.data) {
            setIsLoggedIn(true);
            setUser(response.data);
            setView('profile');
            // Pre-fill form data if user is logged in
            setFormData(prev => ({
              ...prev,
              firstName: response.data?.first_name || '',
              lastName: response.data?.last_name || '',
              email: response.data?.email || '',
              telephone: response.data?.user_phone || '',
              address: response.data?.user_address || '',
              numChildren: response.data?.children?.length || 1,
              childDOBs: response.data?.children?.map(c => c.child_dob) || ['']
            }));
          } else {
            api.removeToken();
            setIsLoggedIn(false);
            setUser(null);
          }
        } catch (error) {
          console.error('Auth check failed:', error);
        }
      }
    };
    checkAuth();
  }, []);

  // Handle URL Routing for /price/:id
  useEffect(() => {
    const handleUrlRoute = async () => {
      const path = window.location.pathname;
      const priceMatch = path.match(/\/price\/(\d+)/);

      if (priceMatch) {
        const id = parseInt(priceMatch[1]);

        try {
          setIsRegistering(true);
          const data = await api.getSingleParentRequest(id);
          if (data) {
            mapRequestToState(data);
          }
        } catch (error) {
          console.error('Failed to fetch parent request from URL:', error);
        } finally {
          setIsRegistering(false);
        }
      }
    };
    handleUrlRoute();
  }, [localizedSitters]);

  const mapRequestToState = (data: ParentRequest) => {
    setParentRequestId(data.id);
    setFormData({
      firstName: data.user.first_name,
      lastName: data.user.last_name,
      email: data.user.email,
      address: data.parent_address,
      numChildren: data.children?.length || 1,
      childDOBs: data.children?.map(c => c.child_dob) || [''],
      telephone: data.user.user_phone || '',
      countryCode: '+1',
    });

    if (data.schedules) {
      const mappedSchedules = data.schedules.map(s => ({
        id: s.schedule_date,
        date: new Date(s.schedule_date),
        dbId: s.id,
        slots: s.slots.map(slot => ({
          id: Math.random().toString(36).substr(2, 9),
          dbId: slot.id,
          startTime: slot.start_time,
          endTime: slot.end_time
        }))
      }));
      setDateSchedule(mappedSchedules);
    }

    if (data.choices && data.choices.length > 0) {
      setSelectedCandidates(data.choices.map(c => ({
        sitterId: 0,
        dbId: c.id,
        interview: {
          date: c.interview_date || '',
          time: c.interview_time || '',
          skipped: !c.interview_date
        }
      })));
    }

    setCurrentStep(3);
    setView('booking');
  };

  useEffect(() => {
    const fetchSchedules = async () => {
      if (currentStep === 2 && parentRequestId) {
        try {
          setIsRegistering(true);
          const response = await api.getParentSchedules(parentRequestId);
          if (response.status && response.data) {
            const mappedSchedules = response.data.map((s: any) => ({
              id: s.schedule_date,
              date: new Date(s.schedule_date),
              dbId: s.id,
              slots: s.slots.map((slot: any) => ({
                id: Math.random().toString(36).substr(2, 9),
                dbId: slot.id,
                startTime: slot.start_time,
                endTime: slot.end_time
              }))
            }));
            setDateSchedule(mappedSchedules);
          }
        } catch (error) {
          console.error('Failed to fetch schedules:', error);
        } finally {
          setIsRegistering(false);
        }
      }
    };
    fetchSchedules();
  }, [currentStep, parentRequestId]);

  useEffect(() => {
    const fetchChoices = async () => {
      if (currentStep === 4 && parentRequestId && selectedCandidates.length === 0) {
        try {
          setIsRegistering(true);
          const response = await api.getParentBabysitterChoices(parentRequestId);
          if (response.status && response.data) {
            const mappedChoices = response.data.map((choice: any) => {
              // Try to find the sitter in our local list by email or name
              const sitter = localizedSitters.find(s =>
                s.email === choice.babysitter_email ||
                (s.name.toLowerCase() === choice.babysitter_first_name?.toLowerCase() &&
                  s.lastName?.toLowerCase() === choice.babysitter_last_name?.toLowerCase())
              );

              return {
                sitterId: sitter?.id || choice.babysitter_id || 0,
                dbId: choice.id,
                interview: {
                  date: choice.interview_date || '',
                  time: choice.interview_time || '',
                  skipped: !choice.interview_date
                }
              };
            });
            setSelectedCandidates(mappedChoices);
          }
        } catch (error) {
          console.error('Failed to fetch babysitter choices:', error);
        } finally {
          setIsRegistering(false);
        }
      }
    };
    fetchChoices();
  }, [currentStep, parentRequestId]);

  const handleLoginSuccess = async (isAdmin?: boolean) => {
    setIsLoggedIn(true);

    if (isAdmin) {
      setView('admin-dashboard');
    } else {
      setView('profile');
    }
  };

  useEffect(() => {
    const fetchExternalSitters = async () => {
      if (currentStep === 4 && hasMoreSitters && !isFetchingSitters) {
        try {
          setIsFetchingSitters(true);
          const response = await api.getExternalBabysitters(sitterPage, filters);
          if (response && response.data) {
            const mapped = response.data.map((item: any) => {
              const photoBaseUrl = 'https://bloom-buddies.fr/public/uploads/profile_images/';
              const photo = item.profile_pic
                ? `${photoBaseUrl}${item.profile_pic}`
                : `${photoBaseUrl}default.jpg`;

              const languages = [];
              if (item.english_language > 0) languages.push('English');
              if (item.french_language > 0) languages.push('French');

              return {
                id: item.id,
                key: `external-${item.id}`,
                name: item.name || item.first_name || 'Babysitter',
                lastName: item.user_last_name || '',
                age: calculateAgeFromDOB(item.user_dob),
                languages,
                experience: item.babysitter_profiles_experience || 0,
                description: item.babysitter_profiles_about || '',
                fullBio: item.babysitter_profiles_personal || '',
                photo,
                status: item.user_status === 1 ? 'Online' : 'Available',
                rating: (item.rating1 && !isNaN(parseFloat(item.rating1))) ? parseFloat(item.rating1) : 4.5,
                reviews: Math.floor(Math.random() * 50),
                email: item.email,
                phone: item.user_phone,
                address: item.babysitter_profiles_address
              };
            });

            setExternalSitters(prev => {
              if (sitterPage === 1) return mapped;
              const existingIds = new Set(prev.map(s => s.id));
              const newSitters = mapped.filter((s: any) => !existingIds.has(s.id));
              return [...prev, ...newSitters];
            });

            if (response.current_page >= response.last_page) {
              setHasMoreSitters(false);
            }
          }
        } catch (error) {
          console.error('Failed to fetch external babysitters:', error);
        } finally {
          setIsFetchingSitters(false);
        }
      }
    };

    fetchExternalSitters();
  }, [currentStep, sitterPage, filters]);

  // Reset pagination when filters change
  useEffect(() => {
    if (currentStep === 4) {
      setSitterPage(1);
      setHasMoreSitters(true);
    }
  }, [filters, currentStep]);

  const calculateAgeFromDOB = (dob: string) => {
    if (!dob) return 20;
    const birthDate = new Date(dob);
    if (isNaN(birthDate.getTime())) return 20;
    const today = new Date();
    let age = today.getFullYear() - birthDate.getFullYear();
    const m = today.getMonth() - birthDate.getMonth();
    if (m < 0 || (m === 0 && today.getDate() < birthDate.getDate())) {
      age--;
    }
    return age;
  };

  const loaderRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const observer = new IntersectionObserver((entries) => {
      if (entries[0].isIntersecting && hasMoreSitters && !isFetchingSitters && currentStep === 4) {
        setSitterPage(prev => prev + 1);
      }
    }, { threshold: 0.1 });

    if (loaderRef.current) {
      observer.observe(loaderRef.current);
    }

    return () => observer.disconnect();
  }, [hasMoreSitters, isFetchingSitters, currentStep]);

  const handleModifyRequest = (request: any) => {
    setFormData({
      firstName: user?.first_name || '',
      lastName: user?.last_name || '',
      email: user?.email || '',
      telephone: user?.user_phone?.replace(formData.countryCode, '') || '',
      address: request.parent_address || '',
      numChildren: request.children?.length || 1,
      childDOBs: request.children?.map((c: any) => c.child_dob) || [''],
      countryCode: formData.countryCode, // Keep current country code or try to parse from user_phone
    });
    setParentRequestId(request.id);
    setIsModifying(true);
    setView('booking');
    setCurrentStep(1);
  };

  // Step 4 State (Babysitter Matching)
  const [selectedCandidates, setSelectedCandidates] = useState<Array<{
    sitterId: number,
    dbId?: number,
    interview: { date: string, time: string, skipped: boolean }
  }>>([]);
  const [viewingBabysitter, setViewingBabysitter] = useState<Babysitter | null>(null);
  const [schedulingSitter, setSchedulingSitter] = useState<Babysitter | null>(null);
  const [modalInterviewConfig, setModalInterviewConfig] = useState({
    date: '',
    time: '10:00',
    skipped: false
  });
  const [modalError, setModalError] = useState('');

  const filteredCountries = COUNTRY_CODES.filter(c =>
    c.country.toLowerCase().includes(countrySearch.toLowerCase()) ||
    c.code.includes(countrySearch)
  );

  const selectedCountry = COUNTRY_CODES.find(c => c.code === formData.countryCode) || COUNTRY_CODES[0];

  // Update childDOBs array when numChildren changes
  useEffect(() => {
    setFormData(prev => {
      const newDOBs = [...prev.childDOBs];
      if (prev.numChildren > newDOBs.length) {
        // Add fields
        for (let i = newDOBs.length; i < prev.numChildren; i++) {
          newDOBs.push('');
        }
      } else if (prev.numChildren < newDOBs.length) {
        // Remove fields
        newDOBs.splice(prev.numChildren);
      }
      return { ...prev, childDOBs: newDOBs };
    });
  }, [formData.numChildren]);

  const validateStep1 = () => {
    const newErrors: FormErrors = {};
    if (!formData.firstName.trim()) newErrors.firstName = 'First name is required';
    if (!formData.lastName.trim()) newErrors.lastName = 'Last name is required';
    if (!formData.address.trim()) newErrors.address = 'Address is required';
    if (!formData.telephone.trim()) newErrors.telephone = 'Telephone is required';
    if (!formData.email.trim()) {
      newErrors.email = 'Email is required';
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = 'Email is invalid';
    }

    formData.childDOBs.forEach((dob, index) => {
      if (!dob.trim()) {
        newErrors[`childDOB_${index}`] = 'DOB is required';
      }
    });

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const validateStep2 = () => {
    const newErrors: FormErrors = {};

    if (dateSchedule.length === 0) {
      newErrors.schedule = 'Please select at least one babysitting date.';
    }

    dateSchedule.forEach(item => {
      if (item.slots.length === 0) {
        newErrors[`${item.id}_slots`] = 'Please add at least one time slot for this date.';
      }

      item.slots.forEach(slot => {
        const start = new Date(`2000-01-01T${slot.startTime}`);
        const end = new Date(`2000-01-01T${slot.endTime}`);

        if (start.getTime() === end.getTime()) {
          newErrors[`${item.id}_${slot.id}_time`] = 'Start and end time cannot be the same';
        } else if (end.getTime() < start.getTime()) {
          newErrors[`${item.id}_${slot.id}_time`] = 'End time must be after start time';
        }
      });
    });

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const validateStep4 = () => {
    const newErrors: FormErrors = {};
    const selectedCount = selectedCandidates.length;

    if (selectedCount < 1) {
      newErrors.candidates = 'Please select at least 1 candidate to continue';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const refreshUser = async () => {
    const token = api.getToken();
    if (token) {
      try {
        const response = await api.getUser();
        if (response.status && response.data) {
          setUser(response.data);
        }
      } catch (error) {
        console.error('Failed to refresh user:', error);
      }
    }
  };

  const handleNextStep = async () => {
    if (currentStep === 1) {
      if (validateStep1()) {
        setIsRegistering(true);
        setErrors({});

        try {
          let response;
          if (isModifying && parentRequestId) {
            response = await api.updateParentRequest(parentRequestId, {
              first_name: formData.firstName,
              last_name: formData.lastName,
              parent_address: formData.address,
              children: formData.childDOBs.map((dob, idx) => {
                // Try to find existing child ID if we have it
                const existingRequest = user?.parent_requests?.find(r => r.id === parentRequestId);
                const existingChild = existingRequest?.children[idx];
                return {
                  id: existingChild?.id,
                  child_dob: dob
                };
              }),
            });
          } else {
            response = await api.register({
              first_name: formData.firstName,
              last_name: formData.lastName,
              email: formData.email,
              user_phone: formData.countryCode + formData.telephone,
              user_address: formData.address,
              children: formData.childDOBs.map(dob => ({ child_dob: dob })),
            }, parentRequestId || undefined);
          }

          if (response.status && response.data) {
            // Case 1 & 2: Success
            if (response.data.token) {
              api.setToken(response.data.token);
              setIsLoggedIn(true);
            }

            if (response.data.parent_request) {
              setParentRequestId(response.data.parent_request.id);
            }

            // Refresh user data to reflect new/updated request
            refreshUser();

            setCurrentStep(2);
            window.scrollTo({ top: 0, behavior: 'smooth' });
          } else if (response.code === 409) {
            // Case 3: Conflict - Redirect to login
            setView('login');
            setErrors({ email: response.message });
          } else if (response.errors) {
            // Case 4: Validation Errors
            const apiErrors: FormErrors = {};
            Object.entries(response.errors).forEach(([key, messages]) => {
              // Map API keys to form keys
              let formKey = key;
              if (key === 'first_name') formKey = 'firstName';
              if (key === 'last_name') formKey = 'lastName';
              if (key === 'user_phone') formKey = 'telephone';
              if (key === 'user_address') formKey = 'address';

              // Handle nested children errors: children.0.child_dob -> childDOB_0
              if (key.startsWith('children.')) {
                const parts = key.split('.');
                if (parts.length >= 2) {
                  formKey = `childDOB_${parts[1]}`;
                }
              }

              apiErrors[formKey] = messages[0];
            });
            setErrors(apiErrors);
          } else {
            setErrors({ email: response.message || 'Registration failed' });
          }
        } catch (error) {
          setErrors({ email: 'Network error. Please try again.' });
        } finally {
          setIsRegistering(false);
        }
      }
    } else if (currentStep === 2) {
      if (validateStep2()) {
        if (parentRequestId) {
          const saveSchedules = async () => {
            try {
              setIsRegistering(true);

              // Separate existing and new schedules
              const existingSchedules = dateSchedule.filter(s => s.dbId);
              const newSchedules = dateSchedule.filter(s => !s.dbId);

              // Update existing schedules
              for (const schedule of existingSchedules) {
                await api.updateParentSchedule(schedule.dbId!, {
                  date: schedule.id,
                  slots: schedule.slots.map(slot => ({
                    id: slot.dbId,
                    start_time: slot.startTime,
                    end_time: slot.endTime
                  }))
                });
              }

              // Create new schedules
              if (newSchedules.length > 0) {
                await api.createParentSchedules({
                  parent_request_id: parentRequestId,
                  schedules: newSchedules.map(s => ({
                    date: s.id,
                    slots: s.slots.map(slot => ({
                      start_time: slot.startTime,
                      end_time: slot.endTime
                    }))
                  }))
                });
              }

              // Refresh to get all IDs
              const refreshResponse = await api.getParentSchedules(parentRequestId);
              if (refreshResponse.status && refreshResponse.data) {
                const mappedSchedules = refreshResponse.data.map((s: any) => ({
                  id: s.schedule_date,
                  date: new Date(s.schedule_date),
                  dbId: s.id,
                  slots: s.slots.map((slot: any) => ({
                    id: Math.random().toString(36).substr(2, 9),
                    dbId: slot.id,
                    startTime: slot.start_time,
                    endTime: slot.end_time
                  }))
                }));
                setDateSchedule(mappedSchedules);
              }

              setCurrentStep(3);
              window.scrollTo({ top: 0, behavior: 'smooth' });
            } catch (error) {
              console.error('Failed to save schedules:', error);
              setErrors({ schedule: 'Failed to save schedule. Please try again.' });
            } finally {
              setIsRegistering(false);
            }
          };
          saveSchedules();
        } else {
          setCurrentStep(3);
          window.scrollTo({ top: 0, behavior: 'smooth' });
        }
      }
    } else if (currentStep === 3) {
      setCurrentStep(4);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    } else if (currentStep === 4) {
      if (validateStep4()) {
        if (parentRequestId) {
          const saveChoices = async () => {
            try {
              setIsRegistering(true);

              await api.createBabysitterChoices({
                parent_request_id: parentRequestId,
                choices: selectedCandidates.map((c, index) => {
                  const sitter = localizedSitters.find(s => s.id === c.sitterId);

                  return {
                    choice_order: index + 1,
                    babysitter_first_name: sitter?.name || "Babysitter",
                    babysitter_last_name: sitter?.lastName || "Unknown",
                    babysitter_email: sitter?.email || `${sitter?.name?.toLowerCase() || 'babysitter'}@example.com`,
                    babysitter_phone: sitter?.phone || "00000000000",
                    babysitter_address: sitter?.address || "Not Provided",
                    interview_date: c.interview.skipped ? undefined : c.interview.date,
                    interview_time: c.interview.skipped ? undefined : c.interview.time
                  };
                })
              });

              setIsPaymentModalOpen(true);

            } catch (error) {
              console.error('Failed to save babysitter choices:', error);
              setErrors({ candidates: 'Failed to save your selection. Please try again.' });
            } finally {
              setIsRegistering(false);
            }
          };
          saveChoices();
        } else {
          setIsPaymentModalOpen(true);
        }
      }
    }
  };

  const handleBackStep = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  const confirmCandidateSelection = () => {
    if (!schedulingSitter) return;

    if (!modalInterviewConfig.skipped) {
      if (!modalInterviewConfig.date || !modalInterviewConfig.time) {
        setModalError('Please select both date and time for the interview');
        return;
      }

      const selectedDate = new Date(modalInterviewConfig.date);
      const today = new Date();
      today.setHours(0, 0, 0, 0);

      if (selectedDate < today) {
        setModalError('You cannot select a past date');
        return;
      }
    }

    setSelectedCandidates(prev => {
      const existingIndex = prev.findIndex(c => c.sitterId === schedulingSitter.id);
      if (existingIndex !== -1) {
        // Update existing
        const next = [...prev];
        next[existingIndex] = {
          ...next[existingIndex],
          interview: { ...modalInterviewConfig }
        };
        return next;
      } else {
        // Add new
        return [...prev, {
          sitterId: schedulingSitter.id,
          interview: { ...modalInterviewConfig }
        }];
      }
    });

    setSchedulingSitter(null);
    setModalInterviewConfig({ date: '', time: '10:00', skipped: false });
    setModalError('');

    if (errors.candidates) {
      setErrors(prev => {
        const { candidates, ...rest } = prev;
        return rest;
      });
    }
  };

  const removeCandidate = (id: number) => {
    setSelectedCandidates(prev => prev.filter(c => c.sitterId !== id));
  };

  const editInterview = (sitterId: number) => {
    const candidate = selectedCandidates.find(c => c.sitterId === sitterId);
    const sitter = localizedSitters.find(s => s.id === sitterId);
    if (candidate && sitter) {
      setSchedulingSitter(sitter);
      setModalInterviewConfig({ ...candidate.interview });
    }
  };

  const calculateTotalHours = () => {
    return dateSchedule
      .reduce((total, item) => {
        const dayTotal = item.slots.reduce((daySum, slot) => {
          if (!slot.startTime || !slot.endTime) return daySum;
          const start = new Date(`2000-01-01T${slot.startTime}`);
          const end = new Date(`2000-01-01T${slot.endTime}`);
          const diff = (end.getTime() - start.getTime()) / (1000 * 60 * 60);
          return daySum + (diff > 0 ? diff : 0);
        }, 0);
        return total + dayTotal;
      }, 0);
  };

  const totalHours = calculateTotalHours();
  const baseSubtotal = totalHours * HOURLY_RATE;

  // 7 Free Hours Benefit
  const hasFreeHour = totalHours >= 1;
  //const freeHourValue = hasFreeHour ? HOURLY_RATE : 0;
  const freeHourValue = 0;
  const subtotalAfterFreeHours = baseSubtotal - freeHourValue;

  const totalBeforeAid = subtotalAfterFreeHours;

  const youngestAge = Math.min(...formData.childDOBs.map(dob => {
    const age = calculateAge(dob);
    return age !== null ? age.years : 99;
  }));

  // 3. CAF AID CALCULATION LOGIC
  const cafCeiling = youngestAge < 3 ? CMG_CEILING_UNDER_3 : CMG_CEILING_3_PLUS;
  const cmgFixedReimbursement = youngestAge < 3 ? 848.47 : youngestAge < 6 ? 424.24 : 0;

  let estimatedCMG = 0;
  let cmgDisplayFormat = "";
  let parentShareAfterCAF = 0;

  if (totalBeforeAid < cafCeiling) {
    if (youngestAge < 6) {
      const cafAidAmount = totalBeforeAid * 0.85;
      parentShareAfterCAF = totalBeforeAid - cafAidAmount;
      cmgDisplayFormat = `${formatCurrency(totalBeforeAid)} - ${formatCurrency(cafAidAmount)}`;
    } else {
      parentShareAfterCAF = totalBeforeAid;
      cmgDisplayFormat = `${formatCurrency(totalBeforeAid)} - ${formatCurrency(0)}`;
    }
  } else {
    parentShareAfterCAF = totalBeforeAid - cmgFixedReimbursement;
    cmgDisplayFormat = `${formatCurrency(totalBeforeAid)} - ${formatCurrency(cmgFixedReimbursement)}`;
  }

  estimatedCMG = parentShareAfterCAF; // Showing the parent share as the "Estimated CMG" result to match reference

  // 4. TAX CREDIT CALCULATION LOGIC
  const annualSpendingLimit = 12000 + (1500 * formData.numChildren);
  const monthlyCreditLimit = (annualSpendingLimit / 2) / 12;

  let estimatedTaxCredit = 0;
  let taxCreditDisplayFormat = "";

  if (parentShareAfterCAF > monthlyCreditLimit) {
    estimatedTaxCredit = parentShareAfterCAF - monthlyCreditLimit;
    taxCreditDisplayFormat = `${formatCurrency(parentShareAfterCAF)} - ${formatCurrency(monthlyCreditLimit)}`;
  } else {
    estimatedTaxCredit = parentShareAfterCAF * 0.5;
    taxCreditDisplayFormat = `${formatCurrency(parentShareAfterCAF)} x ${formatNumber(0.5)}`;
  }

  // 6. FINAL MONTHLY COST
  const finalCostAfterAid = parentShareAfterCAF - estimatedTaxCredit;

  const totalPrice = totalBeforeAid; // For the animated price in Step 2/3

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: name === 'numChildren' ? parseInt(value) : value }));
    // Clear error when user starts typing
    if (errors[name]) {
      setErrors(prev => {
        const newErrors = { ...prev };
        delete newErrors[name];
        return newErrors;
      });
    }
  };

  const handleDOBChange = (index: number, value: string) => {
    const newDOBs = [...formData.childDOBs];
    newDOBs[index] = value;
    setFormData(prev => ({ ...prev, childDOBs: newDOBs }));

    if (errors[`childDOB_${index}`]) {
      setErrors(prev => {
        const newErrors = { ...prev };
        delete newErrors[`childDOB_${index}`];
        return newErrors;
      });
    }
  };

  const toggleDateSelection = (date: Date) => {
    const dateId = date.toISOString().split('T')[0];
    const exists = dateSchedule.find(item => item.id === dateId);

    if (exists) {
      setDateSchedule(prev => prev.filter(item => item.id !== dateId));
    } else {
      setDateSchedule(prev => [...prev, {
        id: dateId,
        date: new Date(date),
        slots: [{ id: Math.random().toString(36).substr(2, 9), startTime: '', endTime: '' }]
      }].sort((a, b) => a.date.getTime() - b.date.getTime()));
    }

    if (errors.schedule) {
      setErrors(prev => {
        const newErrors = { ...prev };
        delete newErrors.schedule;
        return newErrors;
      });
    }
  };

  const addTimeSlot = (dateId: string) => {
    setDateSchedule(prev => prev.map(item => {
      if (item.id === dateId) {
        return {
          ...item,
          slots: [...item.slots, { id: Math.random().toString(36).substr(2, 9), startTime: '', endTime: '' }]
        };
      }
      return item;
    }));
  };

  const removeTimeSlot = (dateId: string, slotId: string) => {
    setDateSchedule(prev => prev.map(item => {
      if (item.id === dateId) {
        const newSlots = item.slots.filter(s => s.id !== slotId);
        if (newSlots.length === 0) {
          // If no slots left, we could either keep it with 0 slots or remove the date.
          // Let's keep it but it will fail validation if empty.
          // Or just don't allow removing the last slot?
          // For now, let's allow it.
        }
        return { ...item, slots: newSlots };
      }
      return item;
    }));
  };

  const updateTimeSlot = (dateId: string, slotId: string, field: 'startTime' | 'endTime', value: string) => {
    setDateSchedule(prev => prev.map(item => {
      if (item.id === dateId) {
        return {
          ...item,
          slots: item.slots.map(slot =>
            slot.id === slotId ? { ...slot, [field]: value } : slot
          )
        };
      }
      return item;
    }));

    if (errors[`${dateId}_${slotId}_time`] || errors.schedule) {
      setErrors(prev => {
        const newErrors = { ...prev };
        delete newErrors[`${dateId}_${slotId}_time`];
        delete newErrors.schedule;
        return newErrors;
      });
    }
  };

  const [animatedPrice, setAnimatedPrice] = useState(0);
  useEffect(() => {
    const timeout = setTimeout(() => {
      if (animatedPrice < totalPrice) {
        setAnimatedPrice(prev => Math.min(totalPrice, prev + (totalPrice - prev) * 0.2 + 0.1));
      } else if (animatedPrice > totalPrice) {
        setAnimatedPrice(prev => Math.max(totalPrice, prev - (prev - totalPrice) * 0.2 - 0.1));
      }
    }, 30);
    return () => clearTimeout(timeout);
  }, [totalPrice, animatedPrice]);

  return (
    <div className={`min-h-screen flex flex-col items-center ${view === 'admin-dashboard' ? 'bg-slate-50' : 'bg-brand-beige'}`}>
      {/* Header / Navigation */}
      {view !== 'admin-dashboard' && (
        <header className="w-full bg-white/80 backdrop-blur-md border-b border-slate-100 sticky top-0 z-50">
          <div className="max-w-7xl mx-auto px-4 h-20 flex items-center justify-between">
            <div
              className="flex items-center gap-3 cursor-pointer group"
              onClick={() => setView('booking')}
            >
              <div className="w-10 h-10 bg-brand-accent rounded-2xl flex items-center justify-center text-white shadow-lg shadow-brand-accent/20 group-hover:scale-110 transition-transform">
                <Baby size={24} />
              </div>
              <span className="text-xl font-display font-bold text-slate-800 tracking-tight">NannyMatch</span>
            </div>

            <div className="flex items-center gap-6">
              {/* Language Switcher */}
              <div className="hidden sm:flex items-center gap-1 bg-slate-100 p-1 rounded-xl border border-slate-200">
                <button
                  onClick={() => setLanguage('en')}
                  className={`px-3 py-1.5 text-[10px] font-bold uppercase tracking-widest rounded-lg transition-all ${language === 'en' ? 'bg-white text-brand-accent shadow-sm' : 'text-slate-400 hover:text-slate-600'
                    }`}
                >
                  EN
                </button>
                <button
                  onClick={() => setLanguage('fr')}
                  className={`px-3 py-1.5 text-[10px] font-bold uppercase tracking-widest rounded-lg transition-all ${language === 'fr' ? 'bg-white text-brand-accent shadow-sm' : 'text-slate-400 hover:text-slate-600'
                    }`}
                >
                  FR
                </button>
              </div>

              <button
                onClick={() => {
                  if (view === 'profile' || view === 'login') {
                    setView('booking');
                  } else {
                    setView(isLoggedIn ? 'profile' : 'login');
                  }
                }}
                className={`flex items-center gap-2 px-4 py-2 rounded-2xl font-bold text-sm transition-all ${view === 'profile' || view === 'login'
                    ? 'bg-brand-accent text-white shadow-lg shadow-brand-accent/20'
                    : 'bg-white border border-slate-200 text-slate-600 hover:border-brand-accent hover:text-brand-accent'
                  }`}
              >
                <UserIcon size={18} />
                <span className="hidden md:inline">
                  {view === 'profile' || view === 'login'
                    ? t.common.back || 'Booking'
                    : (isLoggedIn ? t.profilePage.title : t.login.title)}
                </span>
              </button>
            </div>
          </div>
        </header>
      )}

      <main className={`${view === 'admin-dashboard' ? 'w-full' : 'w-full max-w-7xl mx-auto p-4 md:p-8 flex flex-col items-center'}`}>
        <AnimatePresence mode="wait">
          {view === 'admin-dashboard' ? (
            <motion.div
              key="admin"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="w-full"
            >
              <AdminDashboard
                onLogout={() => {
                  api.removeToken();       // remove auth token
                  setIsLoggedIn(false);    // update login state
                  setUser(null);           // clear user
                  setView('booking');      // go to index page
                  setCurrentStep(1);       // if you use this
                  setIsModifying(false);   // optional reset
                  setParentRequestId(null); // optional reset
                }}
              />
            </motion.div>
          ) : view === 'profile' ? (
            <motion.div
              key="profile"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="w-full"
            >
              <ProfilePage
                onBack={() => setView('booking')}
                onLogout={() => {
                  api.removeToken();
                  setIsLoggedIn(false);
                  setUser(null);
                  setView('booking');
                  setCurrentStep(1);
                  setIsModifying(false);
                  setParentRequestId(null);
                }}
                onModifyRequest={handleModifyRequest}
                onGoToAdmin={() => setView('admin-dashboard')}
              />
            </motion.div>
          ) : view === 'login' ? (
            <motion.div
              key="login"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="w-full"
            >
              <LoginScreen
                onLoginSuccess={handleLoginSuccess}
                onBackToBooking={() => setView('booking')}
                initialEmail={formData.email}
              />
            </motion.div>
          ) : (
            <motion.div
              key="booking"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="w-full flex flex-col items-center"
            >
              {/* Progress Indicator */}
              <div className="w-full max-w-2xl mb-8">
                <div className="flex items-center justify-between mb-2 px-1">
                  <span className="text-xs font-semibold uppercase tracking-wider text-slate-400">{t.common.step} {currentStep} {t.common.of} 4</span>
                  <span className="text-xs font-bold text-brand-accent uppercase tracking-wider">
                    {currentStep === 1 ? t.steps.familyInfo : currentStep === 2 ? t.steps.scheduleQuote : currentStep === 3 ? t.step3.title : t.steps.matching}
                  </span>
                </div>
                <div className="h-2 w-full bg-slate-200 rounded-full overflow-hidden">
                  <motion.div
                    initial={{ width: 0 }}
                    animate={{ width: `${(currentStep / 4) * 100}%` }}
                    className="h-full bg-brand-accent transition-all duration-500"
                  />
                </div>
              </div>

              <AnimatePresence mode="wait">
                {currentStep === 1 ? (
                  <motion.div
                    key="step1"
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: 20 }}
                    className="w-full max-w-2xl bg-white rounded-[24px] shadow-xl shadow-slate-200/50 p-8 md:p-12 relative overflow-hidden"
                  >
                    {/* Decorative background elements */}
                    <div className="absolute top-0 right-0 w-32 h-32 bg-brand-pink/30 rounded-full -mr-16 -mt-16 blur-3xl" />
                    <div className="absolute bottom-0 left-0 w-32 h-32 bg-brand-blue/30 rounded-full -ml-16 -mb-16 blur-3xl" />

                    <div className="relative z-10">
                      <h1 className="text-3xl font-display font-bold text-slate-800 mb-2">{t.step1.title}</h1>
                      <p className="text-slate-500 mb-8">{t.step1.subtitle}</p>

                      <div className="space-y-6">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                          {/* First Name */}
                          <div className="space-y-2">
                            <label className="text-sm font-semibold text-slate-700 flex items-center gap-2">
                              <UserIcon size={16} className="text-brand-accent" />
                              {t.step1.firstName}
                            </label>
                            <input
                              type="text"
                              name="firstName"
                              value={formData.firstName}
                              onChange={handleInputChange}
                              placeholder={t.step1.placeholders.firstName}
                              className={`w-full px-4 py-3 rounded-xl border bg-slate-50/50 transition-all focus:outline-none focus:ring-2 focus:ring-brand-accent/20 ${errors.firstName ? 'border-red-400 ring-2 ring-red-100' : 'border-slate-200 focus:border-brand-accent'
                                }`}
                            />
                            {errors.firstName && (
                              <p className="text-xs text-red-500 flex items-center gap-1 mt-1">
                                <AlertCircle size={12} /> {errors.firstName}
                              </p>
                            )}
                          </div>

                          {/* Last Name */}
                          <div className="space-y-2">
                            <label className="text-sm font-semibold text-slate-700 flex items-center gap-2">
                              <UserIcon size={16} className="text-brand-accent" />
                              {t.step1.lastName}
                            </label>
                            <input
                              type="text"
                              name="lastName"
                              value={formData.lastName}
                              onChange={handleInputChange}
                              placeholder={t.step1.placeholders.lastName}
                              className={`w-full px-4 py-3 rounded-xl border bg-slate-50/50 transition-all focus:outline-none focus:ring-2 focus:ring-brand-accent/20 ${errors.lastName ? 'border-red-400 ring-2 ring-red-100' : 'border-slate-200 focus:border-brand-accent'
                                }`}
                            />
                            {errors.lastName && (
                              <p className="text-xs text-red-500 flex items-center gap-1 mt-1">
                                <AlertCircle size={12} /> {errors.lastName}
                              </p>
                            )}
                          </div>
                        </div>

                        {/* Address */}
                        <div className="space-y-2">
                          <label className="text-sm font-semibold text-slate-700 flex items-center gap-2">
                            <MapPin size={16} className="text-brand-accent" />
                            {t.step1.address}
                          </label>
                          <input
                            type="text"
                            name="address"
                            value={formData.address}
                            onChange={handleInputChange}
                            placeholder={t.step1.placeholders.address}
                            className={`w-full px-4 py-3 rounded-xl border bg-slate-50/50 transition-all focus:outline-none focus:ring-2 focus:ring-brand-accent/20 ${errors.address ? 'border-red-400 ring-2 ring-red-100' : 'border-slate-200 focus:border-brand-accent'
                              }`}
                          />
                          {errors.address && (
                            <p className="text-xs text-red-500 flex items-center gap-1 mt-1">
                              <AlertCircle size={12} /> {errors.address}
                            </p>
                          )}
                        </div>

                        {/* Number of Children */}
                        <div className="space-y-2">
                          <label className="text-sm font-semibold text-slate-700 flex items-center gap-2">
                            <Baby size={16} className="text-brand-accent" />
                            {t.step1.numChildren}
                          </label>
                          <select
                            name="numChildren"
                            value={formData.numChildren}
                            onChange={handleInputChange}
                            className="w-full px-4 py-3 rounded-xl border border-slate-200 bg-slate-50/50 transition-all focus:outline-none focus:ring-2 focus:ring-brand-accent/20 focus:border-brand-accent appearance-none cursor-pointer"
                          >
                            {[1, 2, 3, 4, 5].map(num => (
                              <option key={num} value={num}>{num} {num === 1 ? t.common.child : t.common.children}</option>
                            ))}
                          </select>
                        </div>

                        {/* Dynamic DOBs */}
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                          <AnimatePresence mode="popLayout">
                            {formData.childDOBs.map((dob, index) => {
                              const age = calculateAge(dob);
                              return (
                                <motion.div
                                  key={`dob-${index}`}
                                  initial={{ opacity: 0, y: 10 }}
                                  animate={{ opacity: 1, y: 0 }}
                                  exit={{ opacity: 0, scale: 0.95 }}
                                  className="space-y-2 p-4 rounded-2xl bg-slate-50 border border-slate-100 relative"
                                >
                                  <div className="flex justify-between items-center mb-1">
                                    <label className="text-[10px] uppercase font-bold text-slate-400 tracking-wider">
                                      {t.step1.childDob.replace('{n}', (index + 1).toString())}
                                    </label>
                                    {age !== null && (
                                      <span className="text-[10px] font-bold bg-brand-accent/10 text-brand-accent px-2 py-0.5 rounded-full">
                                        {formatAge(age)} {language === 'fr' ? '' : 'old'}
                                      </span>
                                    )}
                                  </div>
                                  <input
                                    type="date"
                                    value={dob}
                                    onChange={(e) => handleDOBChange(index, e.target.value)}
                                    className={`w-full px-3 py-2 rounded-lg border bg-white transition-all focus:outline-none focus:ring-2 focus:ring-brand-accent/20 ${errors[`childDOB_${index}`] ? 'border-red-400 ring-1 ring-red-100' : 'border-slate-200 focus:border-brand-accent'
                                      }`}
                                  />
                                  {errors[`childDOB_${index}`] && (
                                    <p className="text-[10px] text-red-500 mt-1">{errors[`childDOB_${index}`]}</p>
                                  )}
                                </motion.div>
                              );
                            })}
                          </AnimatePresence>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                          {/* Telephone */}
                          <div className="space-y-2">
                            <label className="text-sm font-semibold text-slate-700 flex items-center gap-2">
                              <Phone size={16} className="text-brand-accent" />
                              {t.step1.phone}
                            </label>
                            <div className="relative">
                              <div className={`flex items-center w-full rounded-xl border bg-slate-50/50 transition-all focus-within:ring-2 focus-within:ring-brand-accent/20 focus-within:border-brand-accent ${errors.telephone ? 'border-red-400 ring-2 ring-red-100' : 'border-slate-200'
                                }`}>
                                {/* Integrated Country Selector */}
                                <div className="relative">
                                  <button
                                    type="button"
                                    onClick={() => setIsCountryDropdownOpen(!isCountryDropdownOpen)}
                                    className="flex items-center gap-1.5 px-3 py-3 border-r border-slate-200 hover:bg-slate-100/50 transition-colors rounded-l-xl min-w-[80px] justify-center"
                                  >
                                    <span className="text-lg leading-none">{selectedCountry.flag}</span>
                                    <span className="text-sm font-medium text-slate-700">{selectedCountry.code}</span>
                                  </button>

                                  <AnimatePresence>
                                    {isCountryDropdownOpen && (
                                      <>
                                        <div
                                          className="fixed inset-0 z-40"
                                          onClick={() => setIsCountryDropdownOpen(false)}
                                        />
                                        <motion.div
                                          initial={{ opacity: 0, y: 10, scale: 0.95 }}
                                          animate={{ opacity: 1, y: 0, scale: 1 }}
                                          exit={{ opacity: 0, y: 10, scale: 0.95 }}
                                          className="absolute left-0 top-full mt-2 w-64 bg-white border border-slate-200 rounded-xl shadow-2xl z-50 overflow-hidden"
                                        >
                                          <div className="p-2 border-bottom border-slate-100">
                                            <input
                                              autoFocus
                                              type="text"
                                              placeholder={t.common.searchCountry}
                                              value={countrySearch}
                                              onChange={(e) => setCountrySearch(e.target.value)}
                                              className="w-full px-3 py-2 text-sm bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:border-brand-accent"
                                            />
                                          </div>
                                          <div className="max-h-60 overflow-y-auto p-1">
                                            {filteredCountries.length > 0 ? (
                                              filteredCountries.map((c) => (
                                                <button
                                                  key={c.iso}
                                                  type="button"
                                                  onClick={() => {
                                                    setFormData(prev => ({ ...prev, countryCode: c.code }));
                                                    setIsCountryDropdownOpen(false);
                                                    setCountrySearch('');
                                                  }}
                                                  className={`flex items-center justify-between w-full px-3 py-2 text-sm rounded-lg transition-colors hover:bg-slate-50 ${formData.countryCode === c.code ? 'bg-brand-accent/5 text-brand-accent font-medium' : 'text-slate-700'
                                                    }`}
                                                >
                                                  <div className="flex items-center gap-3">
                                                    <span className="text-lg">{c.flag}</span>
                                                    <span>{c.country}</span>
                                                  </div>
                                                  <span className="text-slate-400 font-mono">{c.code}</span>
                                                </button>
                                              ))
                                            ) : (
                                              <div className="px-3 py-4 text-center text-slate-400 text-sm italic">
                                                {t.common.noCountries}
                                              </div>
                                            )}
                                          </div>
                                        </motion.div>
                                      </>
                                    )}
                                  </AnimatePresence>
                                </div>

                                <input
                                  type="tel"
                                  name="telephone"
                                  value={formData.telephone}
                                  onChange={handleInputChange}
                                  placeholder={t.step1.placeholders.phone}
                                  className="flex-1 px-4 py-3 bg-transparent border-none focus:ring-0 focus:outline-none text-slate-700 placeholder:text-slate-300"
                                />
                              </div>
                            </div>
                            {errors.telephone && (
                              <p className="text-xs text-red-500 flex items-center gap-1 mt-1">
                                <AlertCircle size={12} /> {errors.telephone}
                              </p>
                            )}
                          </div>



                          {/* Email */}
                          <div className="space-y-2">
                            <label className="text-sm font-semibold text-slate-700 flex items-center gap-2">
                              <Mail size={16} className="text-brand-accent" />
                              {t.step1.email}
                            </label>
                            <input
                              type="email"
                              name="email"
                              value={formData.email}
                              onChange={handleInputChange}
                              readOnly={isLoggedIn}
                              placeholder={t.step1.placeholders.email}
                              className={`w-full px-4 py-3 rounded-xl border transition-all focus:outline-none focus:ring-2 focus:ring-brand-accent/20 ${isLoggedIn ? 'bg-slate-100 text-slate-500 cursor-not-allowed' : 'bg-slate-50/50'
                                } ${errors.email ? 'border-red-400 ring-2 ring-red-100' : 'border-slate-200 focus:border-brand-accent'
                                }`}
                            />
                            {errors.email && (
                              <p className="text-xs text-red-500 flex items-center gap-1 mt-1">
                                <AlertCircle size={12} /> {errors.email}
                              </p>
                            )}
                          </div>
                        </div>

                        {/* Submit Button */}
                        <div className="space-y-8 mt-8">
                          <motion.button
                            whileHover={{ scale: 1.02 }}
                            whileTap={{ scale: 0.98 }}
                            onClick={handleNextStep}
                            disabled={isRegistering}
                            className={`w-full bg-brand-accent hover:bg-[#66B2AC] text-white font-display font-bold py-4 rounded-xl shadow-lg shadow-brand-accent/20 flex items-center justify-center gap-2 transition-colors ${isRegistering ? 'opacity-70 cursor-not-allowed' : ''
                              }`}
                          >
                            {isRegistering ? t.common.loading : t.common.next}
                            {!isRegistering && <ChevronRight size={20} />}
                          </motion.button>


                          {isModifying && (
                            <div className="pt-4 text-center">
                              <button
                                onClick={() => {
                                  setIsModifying(false);
                                  setParentRequestId(null);
                                  setView('profile');
                                }}
                                className="text-sm font-bold text-slate-400 hover:text-red-500 flex items-center justify-center gap-2 mx-auto transition-colors"
                              >
                                <X size={16} />
                                {t.common.cancel}
                              </button>
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                  </motion.div>
                ) : currentStep === 2 ? (
                  <motion.div
                    key="step2"
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -20 }}
                    className="w-full max-w-6xl bg-white rounded-[32px] shadow-2xl shadow-slate-200/50 p-6 md:p-10 relative overflow-hidden"
                  >
                    {/* Decorative background elements */}
                    <div className="absolute top-0 right-0 w-32 h-32 bg-brand-pink/30 rounded-full -mr-16 -mt-16 blur-3xl" />
                    <div className="absolute bottom-0 left-0 w-32 h-32 bg-brand-blue/30 rounded-full -ml-16 -mb-16 blur-3xl" />

                    <div className="relative z-10">
                      <div className="flex items-center gap-4 mb-8">
                        <button
                          onClick={handleBackStep}
                          className="p-2 rounded-full hover:bg-slate-100 transition-colors text-slate-400"
                        >
                          <ArrowLeft size={20} />
                        </button>
                        <div>
                          <h1 className="text-3xl font-display font-bold text-slate-800 mb-1">{t.step2.title}</h1>
                          <p className="text-slate-500 text-sm">{t.step2.subtitle}</p>
                        </div>
                      </div>

                      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
                        {/* Left Column: Calendar Selection */}
                        <div className="lg:col-span-6 space-y-8">
                          <div className="bg-slate-50 rounded-3xl p-6 border border-slate-100">
                            <div className="flex items-center justify-between mb-6">
                              <h2 className="font-display font-bold text-slate-800">
                                {calendarViewDate.toLocaleString(language === 'fr' ? 'fr-FR' : 'en-US', { month: 'long', year: 'numeric' })}
                              </h2>
                              <div className="flex gap-2">
                                <button
                                  onClick={() => setCalendarViewDate(new Date(calendarViewDate.setMonth(calendarViewDate.getMonth() - 1)))}
                                  className="p-2 hover:bg-white rounded-xl transition-colors text-slate-400 hover:text-brand-accent border border-transparent hover:border-slate-100"
                                >
                                  <ChevronLeft size={20} />
                                </button>
                                <button
                                  onClick={() => setCalendarViewDate(new Date(calendarViewDate.setMonth(calendarViewDate.getMonth() + 1)))}
                                  className="p-2 hover:bg-white rounded-xl transition-colors text-slate-400 hover:text-brand-accent border border-transparent hover:border-slate-100"
                                >
                                  <ChevronRight size={20} />
                                </button>
                              </div>
                            </div>

                            <div className="grid grid-cols-7 gap-2 mb-2">
                              {Object.values(t.common.days).map(d => (
                                <div key={d} className="text-center text-[10px] font-bold text-slate-400 uppercase tracking-widest py-2">
                                  {d}
                                </div>
                              ))}
                            </div>

                            <div className="grid grid-cols-7 gap-2">
                              {Array.from({ length: new Date(calendarViewDate.getFullYear(), calendarViewDate.getMonth(), 1).getDay() }).map((_, i) => (
                                <div key={`empty-${i}`} />
                              ))}
                              {Array.from({ length: new Date(calendarViewDate.getFullYear(), calendarViewDate.getMonth() + 1, 0).getDate() }).map((_, i) => {
                                const date = new Date(calendarViewDate.getFullYear(), calendarViewDate.getMonth(), i + 1);
                                const dateId = date.toISOString().split('T')[0];
                                const isSelected = dateSchedule.some(item => item.id === dateId);
                                const isToday = new Date().toISOString().split('T')[0] === dateId;

                                return (
                                  <motion.button
                                    key={dateId}
                                    whileHover={{ scale: 1.1 }}
                                    whileTap={{ scale: 0.9 }}
                                    onClick={() => toggleDateSelection(date)}
                                    className={`aspect-square rounded-xl flex flex-col items-center justify-center text-sm font-bold transition-all relative ${isSelected
                                      ? 'bg-brand-accent text-white shadow-lg shadow-brand-accent/20'
                                      : isToday
                                        ? 'bg-brand-blue/30 text-brand-accent border border-brand-blue'
                                        : 'hover:bg-white text-slate-600 border border-transparent hover:border-slate-200'
                                      }`}
                                  >
                                    {i + 1}
                                    {isSelected && (
                                      <motion.div
                                        layoutId="dot"
                                        className="w-1 h-1 bg-white rounded-full mt-0.5"
                                      />
                                    )}
                                  </motion.button>
                                );
                              })}
                            </div>
                          </div>
                        </div>

                        {/* Right Column: Time Slots Management */}
                        <div className="lg:col-span-6 space-y-6">
                          <div className="space-y-4 max-h-[600px] overflow-y-auto pr-2 custom-scrollbar">
                            <AnimatePresence mode="popLayout">
                              {isRegistering && dateSchedule.length === 0 ? (
                                <motion.div
                                  initial={{ opacity: 0 }}
                                  animate={{ opacity: 1 }}
                                  className="text-center py-12 bg-slate-50 rounded-3xl border border-dashed border-slate-200"
                                >
                                  <div className="w-8 h-8 border-4 border-brand-accent border-t-transparent rounded-full animate-spin mx-auto mb-3" />
                                  <p className="text-slate-400 text-sm font-medium">{t.common.loading}</p>
                                </motion.div>
                              ) : dateSchedule.length === 0 ? (
                                <motion.div
                                  initial={{ opacity: 0 }}
                                  animate={{ opacity: 1 }}
                                  className="text-center py-12 bg-slate-50 rounded-3xl border border-dashed border-slate-200"
                                >
                                  <CalendarDays size={40} className="mx-auto text-slate-300 mb-3" />
                                  <p className="text-slate-400 text-sm font-medium">{t.step2.noDates}</p>
                                </motion.div>
                              ) : (
                                dateSchedule.map((item) => (
                                  <motion.div
                                    key={item.id}
                                    layout
                                    initial={{ opacity: 0, y: 20 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    exit={{ opacity: 0, scale: 0.95 }}
                                    className="bg-white rounded-2xl border border-slate-100 p-5 shadow-sm hover:shadow-md transition-all group"
                                  >
                                    <div className="flex items-center justify-between mb-4">
                                      <div className="flex items-center gap-3">
                                        <div className="w-10 h-10 rounded-xl bg-brand-accent/10 text-brand-accent flex items-center justify-center">
                                          <Calendar size={18} />
                                        </div>
                                        <div>
                                          <p className="text-xs font-bold text-slate-400 uppercase tracking-widest">
                                            {item.date.toLocaleDateString(language === 'fr' ? 'fr-FR' : 'en-US', { weekday: 'long' })}
                                          </p>
                                          <p className="font-display font-bold text-slate-800">
                                            {item.date.toLocaleDateString(language === 'fr' ? 'fr-FR' : 'en-US', { day: 'numeric', month: 'long', year: 'numeric' })}
                                          </p>
                                        </div>
                                      </div>
                                      <button
                                        onClick={() => toggleDateSelection(item.date)}
                                        className="p-2 text-slate-300 hover:text-red-400 hover:bg-red-50 rounded-xl transition-colors"
                                      >
                                        <Trash2 size={18} />
                                      </button>
                                    </div>

                                    <div className="space-y-4 pt-4 border-t border-slate-50">
                                      {item.slots.map((slot, sIdx) => (
                                        <div key={slot.id} className="space-y-3">
                                          <div className="flex items-center justify-between">
                                            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest flex items-center gap-1">
                                              Slot #{sIdx + 1}
                                            </span>
                                            {item.slots.length > 1 && (
                                              <button
                                                onClick={() => removeTimeSlot(item.id, slot.id)}
                                                className="text-slate-300 hover:text-red-400 transition-colors"
                                              >
                                                <X size={14} />
                                              </button>
                                            )}
                                          </div>
                                          <div className="grid grid-cols-2 gap-4">
                                            <div className="space-y-1">
                                              <label className="text-[10px] uppercase font-bold text-slate-400 flex items-center gap-1">
                                                <Clock size={10} /> {t.step2.startTime}
                                              </label>
                                              <input
                                                type="time"
                                                value={slot.startTime}
                                                onChange={(e) => updateTimeSlot(item.id, slot.id, 'startTime', e.target.value)}
                                                className="w-full px-3 py-2 rounded-xl border border-slate-200 focus:border-brand-accent focus:ring-2 focus:ring-brand-accent/20 outline-none transition-all text-sm font-medium"
                                              />
                                            </div>
                                            <div className="space-y-1">
                                              <label className="text-[10px] uppercase font-bold text-slate-400 flex items-center gap-1">
                                                <Clock size={10} /> {t.step2.endTime}
                                              </label>
                                              <input
                                                type="time"
                                                value={slot.endTime}
                                                onChange={(e) => updateTimeSlot(item.id, slot.id, 'endTime', e.target.value)}
                                                className={`w-full px-3 py-2 rounded-xl border focus:ring-2 outline-none transition-all text-sm font-medium ${errors[`${item.id}_${slot.id}_time`] ? 'border-red-400 ring-red-100' : 'border-slate-200 focus:border-brand-accent focus:ring-brand-accent/20'
                                                  }`}
                                              />
                                            </div>
                                          </div>
                                          {errors[`${item.id}_${slot.id}_time`] && (
                                            <p className="text-[10px] text-red-500 flex items-center gap-1 font-medium">
                                              <AlertCircle size={10} /> {errors[`${item.id}_${slot.id}_time`]}
                                            </p>
                                          )}
                                        </div>
                                      ))}

                                      <button
                                        onClick={() => addTimeSlot(item.id)}
                                        className="w-full py-2 border border-dashed border-slate-200 rounded-xl text-slate-400 hover:text-brand-accent hover:border-brand-accent hover:bg-brand-accent/5 transition-all text-[10px] font-bold uppercase tracking-widest flex items-center justify-center gap-2"
                                      >
                                        <Plus size={14} />
                                        Add Time Slot
                                      </button>
                                    </div>
                                  </motion.div>
                                ))
                              )}
                            </AnimatePresence>
                            {errors.schedule && (
                              <p className="text-sm text-red-500 text-center font-medium">{errors.schedule}</p>
                            )}
                          </div>

                          <div className="pt-6">
                            <motion.button
                              whileHover={{ scale: 1.02 }}
                              whileTap={{ scale: 0.98 }}
                              disabled={isRegistering || dateSchedule.length === 0 || Object.keys(errors).some(k => k.includes('_time'))}
                              onClick={handleNextStep}
                              className={`w-full font-display font-bold py-5 rounded-2xl shadow-xl flex items-center justify-center gap-3 transition-all text-lg ${isRegistering || dateSchedule.length === 0 || Object.keys(errors).some(k => k.includes('_time'))
                                ? 'bg-slate-200 text-slate-400 cursor-not-allowed shadow-none'
                                : 'bg-brand-accent hover:bg-[#66B2AC] text-white shadow-brand-accent/30'
                                }`}
                            >
                              {isRegistering ? (
                                <div className="w-6 h-6 border-2 border-white border-t-transparent rounded-full animate-spin" />
                              ) : (
                                <ChevronRight size={22} />
                              )}
                              {isRegistering ? t.common.loading : t.step2.validateButton}
                            </motion.button>
                          </div>
                        </div>
                      </div>
                    </div>
                  </motion.div>
                ) : currentStep === 3 ? (
                  <motion.div
                    key="step3"
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -20 }}
                    className="w-full max-w-4xl bg-white rounded-[32px] shadow-2xl shadow-slate-200/50 p-6 md:p-10 relative overflow-hidden"
                  >
                    {/* Decorative background elements */}
                    <div className="absolute top-0 right-0 w-64 h-64 bg-brand-pink/20 rounded-full -mr-32 -mt-32 blur-3xl" />
                    <div className="absolute bottom-0 left-0 w-64 h-64 bg-brand-blue/20 rounded-full -ml-32 -mb-32 blur-3xl" />

                    <div className="relative z-10">
                      <div className="flex items-center gap-4 mb-8">
                        <button
                          onClick={handleBackStep}
                          className="p-2 rounded-full hover:bg-slate-100 transition-colors text-slate-400"
                        >
                          <ArrowLeft size={20} />
                        </button>
                        <div>
                          <h1 className="text-3xl font-display font-bold text-slate-800 mb-1">{t.step3.title}</h1>
                          <p className="text-slate-500 text-sm">{t.step3.subtitle}</p>
                        </div>
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                        <div className="space-y-6">
                          <div className="bg-slate-50 rounded-3xl p-6 border border-slate-100 space-y-4">
                            <h3 className="text-sm font-bold text-slate-400 uppercase tracking-widest flex items-center gap-2">
                              <UserIcon size={16} className="text-brand-accent" />
                              User Information
                            </h3>
                            <div className="space-y-3">
                              <div className="flex justify-between items-center">
                                <span className="text-xs text-slate-500">First Name</span>
                                <span className="text-sm font-bold text-slate-800">{formData.firstName}</span>
                              </div>
                              <div className="flex justify-between items-center">
                                <span className="text-xs text-slate-500">Last Name</span>
                                <span className="text-sm font-bold text-slate-800">{formData.lastName}</span>
                              </div>
                              <div className="flex justify-between items-center">
                                <span className="text-xs text-slate-500">Email</span>
                                <span className="text-sm font-bold text-slate-800">{formData.email}</span>
                              </div>
                              <div className="flex justify-between items-center pt-3 border-t border-slate-200">
                                <span className="text-xs text-slate-500">Quote Date</span>
                                <span className="text-sm font-bold text-brand-accent">{new Date().toLocaleDateString(language === 'fr' ? 'fr-FR' : 'en-US', { day: 'numeric', month: 'long', year: 'numeric' })}</span>
                              </div>
                            </div>
                          </div>

                          <div className="bg-slate-50 rounded-3xl p-6 border border-slate-100 space-y-4">
                            <h3 className="text-sm font-bold text-slate-400 uppercase tracking-widest flex items-center gap-2">
                              <Calendar size={16} className="text-brand-accent" />
                              Schedule Summary
                            </h3>
                            <div className="space-y-2 max-h-[200px] overflow-y-auto pr-2 custom-scrollbar">
                              {dateSchedule.map(item => (
                                <div key={item.id} className="flex justify-between items-center py-2 border-b border-slate-200 last:border-0">
                                  <span className="text-xs font-medium text-slate-600">
                                    {item.date.toLocaleDateString(language === 'fr' ? 'fr-FR' : 'en-US', { day: 'numeric', month: 'short' })}
                                  </span>
                                  <div className="flex flex-col items-end">
                                    {item.slots.map(slot => (
                                      <span key={slot.id} className="text-[10px] text-slate-400">
                                        {slot.startTime} - {slot.endTime}
                                      </span>
                                    ))}
                                  </div>
                                </div>
                              ))}
                            </div>
                          </div>
                        </div>

                        <div className="space-y-6">
                          <div className="bg-white rounded-[32px] p-8 border border-slate-100 shadow-sm flex flex-col space-y-8">
                            <div className="flex items-center justify-between">
                              <h3 className="text-sm font-bold text-slate-400 uppercase tracking-widest flex items-center gap-2">
                                <Receipt size={16} className="text-brand-accent" />
                                {t.step2.priceBreakdown}
                              </h3>
                            </div>

                            <div className="space-y-6">
                              <div className="flex justify-between items-start">
                                <div className="flex flex-col">
                                  <span className="text-sm font-bold text-slate-700">{t.step2.childcarePackage}</span>
                                  <span className="text-[10px] text-slate-400">({formatNumber(totalHours)}h × {formatCurrency(HOURLY_RATE)})</span>
                                </div>
                                <span className="font-bold text-slate-700">{formatCurrency(baseSubtotal)}</span>
                              </div>

                              <div className="flex justify-between items-start pt-6 border-t border-slate-50">
                                <div className="flex flex-col">
                                  <span className="text-sm font-bold text-slate-700">{t.step2.cafAssistance}</span>
                                  <span className="text-[10px] font-mono text-slate-400">{cmgDisplayFormat}</span>
                                </div>
                                <span className="font-bold text-brand-accent">{formatCurrency(estimatedCMG)}</span>
                              </div>

                              <div className="flex justify-between items-start pt-6 border-t border-slate-50">
                                <div className="flex flex-col">
                                  <span className="text-sm font-bold text-slate-700">{t.step2.taxCredit}</span>
                                  <span className="text-[10px] font-mono text-slate-400">{taxCreditDisplayFormat}</span>
                                </div>
                                <span className="font-bold text-emerald-500">{formatCurrency(estimatedTaxCredit)}</span>
                              </div>

                              <div className="pt-8 mt-2 border-t-2 border-dashed border-slate-100 flex justify-between items-center">
                                <div>
                                  <span className="text-sm font-bold text-slate-800 uppercase tracking-wider">{t.step2.finalCost}</span>
                                </div>
                                <span className="text-4xl font-display font-bold text-brand-accent">{formatCurrency(finalCostAfterAid)}</span>
                              </div>
                            </div>
                          </div>

                          <motion.button
                            whileHover={{ scale: 1.02 }}
                            whileTap={{ scale: 0.98 }}
                            onClick={handleNextStep}
                            className="w-full font-display font-bold py-5 bg-brand-accent hover:bg-[#66B2AC] text-white rounded-2xl shadow-xl shadow-brand-accent/30 flex items-center justify-center gap-3 transition-all text-lg"
                          >
                            <ChevronRight size={22} />
                            Continue to Matching
                          </motion.button>
                        </div>
                      </div>
                    </div>
                  </motion.div>
                ) : (
                  <motion.div
                    key="step4"
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -20 }}
                    className="w-full max-w-5xl bg-white rounded-[32px] shadow-2xl shadow-slate-200/50 p-6 md:p-10 relative"
                  >
                    {/* Decorative background elements */}
                    <div className="absolute top-0 right-0 w-64 h-64 bg-brand-pink/20 rounded-full -mr-32 -mt-32 blur-3xl" />
                    <div className="absolute bottom-0 left-0 w-64 h-64 bg-brand-blue/20 rounded-full -ml-32 -mb-32 blur-3xl" />

                    <div className="relative z-10">
                      {isRegistering && (
                        <div className="absolute inset-0 z-50 bg-white/60 backdrop-blur-[2px] flex items-center justify-center rounded-[32px]">
                          <div className="flex flex-col items-center gap-3">
                            <div className="w-12 h-12 border-4 border-brand-accent border-t-transparent rounded-full animate-spin" />
                            <p className="text-slate-500 font-bold animate-pulse">{t.common.loading}</p>
                          </div>
                        </div>
                      )}
                      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-10">
                        <div className="flex items-center gap-4">
                          <button
                            onClick={handleBackStep}
                            className="p-2 rounded-full hover:bg-slate-100 transition-colors text-slate-400"
                          >
                            <ArrowLeft size={20} />
                          </button>
                          <div>
                            <h1 className="text-3xl font-display font-bold text-slate-800 mb-1">{t.step4.title}</h1>
                            <p className="text-slate-500 text-sm">{t.step4.subtitle}</p>
                          </div>
                        </div>
                      </div>

                      {/* Your Selected Candidates Section */}
                      <AnimatePresence>
                        {selectedCandidates.length > 0 && (
                          <motion.div
                            initial={{ opacity: 0, y: -20 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: -20 }}
                            className="mb-12"
                          >
                            <h3 className="text-sm font-bold text-slate-400 uppercase tracking-widest mb-6 flex items-center gap-2">
                              <Award size={16} className="text-brand-accent" />
                              {t.step4.selectedTitle}
                            </h3>
                            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                              {selectedCandidates.map((candidate, index) => {
                                const sitter = localizedSitters.find(s => s.id === candidate.sitterId);
                                if (!sitter) return null;
                                const rankLabel = t.step4.rankLabels[index];

                                return (
                                  <motion.div
                                    key={candidate.sitterId}
                                    layout
                                    initial={{ opacity: 0, scale: 0.9 }}
                                    animate={{ opacity: 1, scale: 1 }}
                                    className="bg-white border-2 border-brand-accent/20 rounded-2xl p-4 shadow-sm relative group"
                                  >
                                    <div className="absolute -top-3 -left-3 w-8 h-8 bg-brand-accent text-white rounded-full flex items-center justify-center font-bold text-xs shadow-lg">
                                      {rankLabel}
                                    </div>
                                    <div className="flex items-center gap-3 mb-3">
                                      <img src={sitter.photo} alt={sitter.name} className="w-10 h-10 rounded-xl object-cover" />
                                      <div className="min-w-0">
                                        <p className="font-bold text-slate-800 text-sm truncate">{sitter.name}</p>
                                        <div className="flex items-center gap-1 text-[10px] text-slate-500">
                                          {candidate.interview.skipped ? (
                                            <span className="flex items-center gap-1"><X size={10} /> {t.common.noInterview}</span>
                                          ) : (
                                            <span className="flex items-center gap-1 text-emerald-600 font-medium">
                                              <Calendar size={10} /> {candidate.interview.date}
                                            </span>
                                          )}
                                        </div>
                                      </div>
                                    </div>
                                    <div className="flex gap-2">
                                      <button
                                        onClick={() => editInterview(sitter.id)}
                                        className="flex-1 py-1.5 text-[10px] font-bold text-brand-accent bg-brand-accent/5 hover:bg-brand-accent/10 rounded-lg transition-colors"
                                      >
                                        {t.common.modify}
                                      </button>
                                      <button
                                        onClick={() => removeCandidate(sitter.id)}
                                        className="p-1.5 text-slate-400 hover:text-red-500 hover:bg-red-50 rounded-lg transition-colors"
                                      >
                                        <Trash2 size={14} />
                                      </button>
                                    </div>
                                  </motion.div>
                                );
                              })}
                            </div>
                          </motion.div>
                        )}
                      </AnimatePresence>

                      {/* Filters */}
                      <div className="flex flex-wrap items-center gap-4 mb-8 p-4 bg-slate-50/50 rounded-2xl border border-slate-100">
                        <div className="flex items-center gap-2 text-slate-500 mr-2">
                          <Filter size={16} />
                          <span className="text-xs font-bold uppercase tracking-wider">{t.common.filters || 'Filters'}</span>
                        </div>

                        {/* Language Filter */}
                        <div className="flex flex-wrap gap-2">
                          {['English', 'French'].map(lang => (
                            <button
                              key={lang}
                              onClick={() => {
                                setFilters(prev => ({
                                  ...prev,
                                  language: prev.language.includes(lang)
                                    ? prev.language.filter(l => l !== lang)
                                    : [...prev.language, lang]
                                }));
                              }}
                              className={`px-3 py-1.5 rounded-xl text-[11px] font-bold transition-all border ${filters.language.includes(lang)
                                ? 'bg-brand-accent border-brand-accent text-white shadow-md shadow-brand-accent/20'
                                : 'bg-white border-slate-200 text-slate-600 hover:border-brand-accent/30'
                                }`}
                            >
                              {lang}
                            </button>
                          ))}
                        </div>

                        <div className="h-6 w-px bg-slate-200 mx-1 hidden md:block" />

                        {/* Age Group Filter */}
                        <div className="flex flex-wrap gap-2">
                          {['Infants', 'Toddlers', 'Preschoolers', 'Young Learners'].map(age => (
                            <button
                              key={age}
                              onClick={() => {
                                setFilters(prev => ({
                                  ...prev,
                                  age_group: prev.age_group.includes(age)
                                    ? prev.age_group.filter(a => a !== age)
                                    : [...prev.age_group, age]
                                }));
                              }}
                              className={`px-3 py-1.5 rounded-xl text-[11px] font-bold transition-all border ${filters.age_group.includes(age)
                                ? 'bg-brand-accent border-brand-accent text-white shadow-md shadow-brand-accent/20'
                                : 'bg-white border-slate-200 text-slate-600 hover:border-brand-accent/30'
                                }`}
                            >
                              {age}
                            </button>
                          ))}
                        </div>

                        <div className="h-6 w-px bg-slate-200 mx-1 hidden md:block" />

                        {/* Experience Filter */}
                        <div className="flex flex-wrap gap-2">
                          {['1+', '3+', '5+', '10+'].map(exp => (
                            <button
                              key={exp}
                              onClick={() => {
                                setFilters(prev => ({
                                  ...prev,
                                  experience: prev.experience === exp ? '' : exp
                                }));
                              }}
                              className={`px-3 py-1.5 rounded-xl text-[11px] font-bold transition-all border ${filters.experience === exp
                                ? 'bg-brand-accent border-brand-accent text-white shadow-md shadow-brand-accent/20'
                                : 'bg-white border-slate-200 text-slate-600 hover:border-brand-accent/30'
                                }`}
                            >
                              {exp} {t.step4.exp}
                            </button>
                          ))}
                        </div>
                      </div>

                      {/* Babysitter Grid */}
                      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-12">
                        {localizedSitters.map((sitter) => {
                          const isSelected = selectedCandidates.some(c => c.sitterId === sitter.id);
                          const isMaxReached = selectedCandidates.length >= 4;

                          return (
                            <motion.div
                              key={sitter.id}
                              whileHover={{ y: -5 }}
                              className={`group relative bg-white rounded-3xl border transition-all duration-300 ${isSelected
                                ? 'border-brand-accent ring-4 ring-brand-accent/5 shadow-xl'
                                : 'border-slate-100 hover:border-brand-accent/30 hover:shadow-lg'
                                }`}
                            >
                              {/* Status Badge */}
                              <div className="absolute top-4 right-4 z-10">
                                <span className={`flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider ${sitter.status === 'Online'
                                  ? 'bg-green-100 text-green-600'
                                  : 'bg-blue-100 text-blue-600'
                                  }`}>
                                  <span className={`w-1.5 h-1.5 rounded-full ${sitter.status === 'Online' ? 'bg-green-500 animate-pulse' : 'bg-blue-500'}`} />
                                  {sitter.status === 'Online' ? t.common.online : t.common.available}
                                </span>
                              </div>

                              <div className="p-6">
                                <div className="flex items-center gap-4 mb-4">
                                  <div className="relative">
                                    <img
                                      src={sitter.photo}
                                      alt={sitter.name}
                                      className="w-16 h-16 rounded-2xl object-cover border-2 border-white shadow-sm"
                                      referrerPolicy="no-referrer"
                                    />
                                    {isSelected && (
                                      <div className="absolute -bottom-1 -right-1 w-6 h-6 bg-brand-accent text-white rounded-full flex items-center justify-center shadow-md border-2 border-white">
                                        <Check size={14} strokeWidth={3} />
                                      </div>
                                    )}
                                  </div>
                                  <div>
                                    <h3 className="font-display font-bold text-slate-800">{sitter.name} {sitter.lastName}</h3>
                                    <p className="text-xs text-slate-500">{sitter.age} {t.step4.years} • {sitter.experience}{t.step4.exp}</p>
                                    <div className="flex items-center gap-1 mt-1">
                                      <Star size={12} className="text-amber-400 fill-amber-400" />
                                      <span className="text-xs font-bold text-slate-700">{sitter.rating}</span>
                                    </div>
                                  </div>
                                </div>

                                <div className="space-y-3 mb-6">
                                  <div className="flex flex-wrap gap-1.5">
                                    {sitter.languages.map(lang => (
                                      <span key={lang} className="px-2 py-0.5 bg-slate-50 text-slate-500 text-[10px] font-medium rounded-md border border-slate-100">
                                        {lang}
                                      </span>
                                    ))}
                                  </div>
                                  <p className="text-xs text-slate-600 line-clamp-2 leading-relaxed">
                                    {sitter.description}
                                  </p>
                                </div>

                                <div className="space-y-3">
                                  <button
                                    onClick={() => setViewingBabysitter(sitter)}
                                    className="w-full py-2.5 text-xs font-bold text-slate-500 hover:text-brand-accent hover:bg-brand-accent/5 rounded-xl transition-colors flex items-center justify-center gap-2"
                                  >
                                    {t.common.viewProfile} <ExternalLink size={14} />
                                  </button>

                                  {isSelected ? (
                                    <div className="bg-emerald-50 border border-emerald-100 rounded-xl p-3 flex items-center justify-between">
                                      <div className="flex items-center gap-2">
                                        <div className="w-6 h-6 bg-emerald-500 text-white rounded-full flex items-center justify-center text-[10px] font-bold">
                                          {selectedCandidates.findIndex(c => c.sitterId === sitter.id) + 1}
                                        </div>
                                        <span className="text-xs font-bold text-emerald-700 uppercase tracking-tighter">{t.step4.selected}</span>
                                      </div>
                                      <button
                                        onClick={() => removeCandidate(sitter.id)}
                                        className="text-[10px] font-bold text-red-500 hover:underline"
                                      >
                                        {t.common.remove}
                                      </button>
                                    </div>
                                  ) : (
                                    <button
                                      onClick={() => setSchedulingSitter(sitter)}
                                      disabled={isMaxReached}
                                      className={`w-full py-2.5 text-xs font-bold rounded-xl transition-all shadow-lg ${isMaxReached
                                        ? 'bg-slate-100 text-slate-400 cursor-not-allowed shadow-none'
                                        : 'bg-slate-800 hover:bg-slate-900 text-white shadow-slate-200'
                                        }`}
                                    >
                                      {isMaxReached ? t.step4.maxCandidates : (
                                        selectedCandidates.length === 0 ? t.step4.selectFirst :
                                          selectedCandidates.length === 1 ? t.step4.selectSecond :
                                            selectedCandidates.length === 2 ? t.step4.selectThird :
                                              selectedCandidates.length === 3 ? t.step4.selectFourth :
                                                t.step4.selectCandidate
                                      )}
                                    </button>
                                  )}
                                </div>
                              </div>
                            </motion.div>
                          );
                        })}
                      </div>

                      {/* Infinite Scroll Loader */}
                      <div ref={loaderRef} className="py-10 flex justify-center">
                        {isFetchingSitters && hasMoreSitters && (
                          <div className="flex flex-col items-center gap-2">
                            <div className="w-8 h-8 border-3 border-brand-accent border-t-transparent rounded-full animate-spin" />
                            <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest">{t.common.loading}</p>
                          </div>
                        )}
                        {!hasMoreSitters && localizedSitters.length > 0 && (
                          <p className="text-xs text-slate-400 font-medium italic">No more babysitters to load.</p>
                        )}
                      </div>

                      {errors.candidates && (
                        <div className="mb-8 p-4 bg-red-50 border border-red-100 rounded-2xl flex items-center gap-3 text-red-600">
                          <AlertCircle size={20} />
                          <p className="text-sm font-medium">{errors.candidates}</p>
                        </div>
                      )}

                      {/* Sticky Footer */}
                      <div className="sticky bottom-0 left-0 right-0 bg-white/90 backdrop-blur-md p-4 -mx-6 md:-mx-10 border-t border-slate-100 flex flex-col sm:flex-row gap-4 z-20">
                        <button
                          onClick={handleBackStep}
                          className="flex-1 py-4 px-8 rounded-2xl border border-slate-200 text-slate-500 font-bold hover:bg-slate-50 transition-colors"
                        >
                          {t.common.back}
                        </button>
                        <motion.button
                          whileHover={{ scale: 1.02 }}
                          whileTap={{ scale: 0.98 }}
                          onClick={handleNextStep}
                          disabled={isRegistering || selectedCandidates.length === 0}
                          className={`flex-[2] font-display font-bold py-4 rounded-2xl shadow-xl flex items-center justify-center gap-2 transition-all ${isRegistering || selectedCandidates.length === 0
                            ? 'bg-slate-100 text-slate-400 cursor-not-allowed shadow-none'
                            : 'bg-brand-accent hover:bg-[#66B2AC] text-white shadow-brand-accent/30'
                            }`}
                        >
                          {isRegistering ? (
                            <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                          ) : (
                            <>
                              {t.step4.submitSelection}
                              <ChevronRight size={20} />
                            </>
                          )}
                        </motion.button>
                      </div>
                      <p className="text-[10px] text-slate-400 text-center mt-6 px-4">
                        {t.step4.paymentNote.replace('{amount}', formatCurrency(19))}
                      </p>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.div>
          )}
        </AnimatePresence>
      </main>

      {/* Payment Modal */}
      <AnimatePresence>
        {isPaymentModalOpen && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => !isPaymentProcessing && setIsPaymentModalOpen(false)}
              className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm"
            />
            <motion.div
              initial={{ opacity: 0, scale: 0.9, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: 20 }}
              className="relative w-full max-w-md bg-white rounded-[32px] shadow-2xl overflow-hidden"
            >
              {!isPaymentSuccess ? (
                <div className="p-8">
                  <div className="flex justify-between items-center mb-8">
                    <h3 className="text-xl font-display font-bold text-slate-800">{t.payment.title}</h3>
                    <button
                      onClick={() => setIsPaymentModalOpen(false)}
                      className="p-2 hover:bg-slate-100 rounded-full transition-colors"
                    >
                      <X size={20} className="text-slate-400" />
                    </button>
                  </div>

                  <div className="bg-slate-50 rounded-2xl p-4 mb-8 border border-slate-100">
                    <div className="flex justify-between items-center mb-2">
                      <span className="text-sm text-slate-500">{t.payment.subtitle}</span>
                      <span className="font-bold text-slate-800">{formatCurrency(19)}</span>
                    </div>
                    <div className="flex justify-between items-center text-xs text-slate-400">
                      <span>Transaction ID</span>
                      <span>#NM-88291-Q</span>
                    </div>
                  </div>

                  <div className="space-y-4">
                    <div className="space-y-1">
                      <label className="text-[10px] uppercase font-bold text-slate-400">{t.payment.cardNumber}</label>
                      <div className="relative">
                        <input
                          type="text"
                          placeholder="0000 0000 0000 0000"
                          className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:border-brand-accent focus:ring-2 focus:ring-brand-accent/20 outline-none transition-all"
                        />
                        <CreditCard size={18} className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-300" />
                      </div>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-1">
                        <label className="text-[10px] uppercase font-bold text-slate-400">{t.payment.expiry}</label>
                        <input
                          type="text"
                          placeholder={t.payment.expiry}
                          className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:border-brand-accent focus:ring-2 focus:ring-brand-accent/20 outline-none transition-all"
                        />
                      </div>
                      <div className="space-y-1">
                        <label className="text-[10px] uppercase font-bold text-slate-400">{t.payment.cvc}</label>
                        <input
                          type="text"
                          placeholder="123"
                          className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:border-brand-accent focus:ring-2 focus:ring-brand-accent/20 outline-none transition-all"
                        />
                      </div>
                    </div>
                  </div>

                  <div className="mt-8 flex items-center gap-2 text-[10px] text-slate-400 justify-center mb-6">
                    <Lock size={12} />
                    {t.payment.securityNote}
                  </div>

                  <motion.button
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={() => {
                      setIsPaymentProcessing(true);
                      setTimeout(() => {
                        setIsPaymentProcessing(false);
                        setIsPaymentSuccess(true);
                        setTimeout(() => {
                          setIsPaymentModalOpen(false);
                          setIsSubmitted(true);
                          // Reset for future if needed
                          setTimeout(() => setIsPaymentSuccess(false), 500);
                        }, 2000);
                      }, 2500);
                    }}
                    disabled={isPaymentProcessing}
                    className="w-full bg-brand-accent hover:bg-[#66B2AC] text-white font-display font-bold py-4 rounded-2xl shadow-lg shadow-brand-accent/20 flex items-center justify-center gap-2 transition-all"
                  >
                    {isPaymentProcessing ? (
                      <>
                        <motion.div
                          animate={{ rotate: 360 }}
                          transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                          className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full"
                        />
                        {t.payment.processing}
                      </>
                    ) : (
                      <>
                        {t.payment.payButton.replace('{amount}', formatCurrency(19))}
                        <ChevronRight size={20} />
                      </>
                    )}
                  </motion.button>
                </div>
              ) : (
                <div className="p-12 text-center">
                  <motion.div
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    className="w-20 h-20 bg-emerald-500 text-white rounded-full flex items-center justify-center mx-auto mb-6 shadow-lg shadow-emerald-500/20"
                  >
                    <Check size={40} />
                  </motion.div>
                  <h3 className="text-2xl font-display font-bold text-slate-800 mb-2">{t.payment.success}</h3>
                  <p className="text-slate-500">{t.payment.redirecting}</p>
                </div>
              )}
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Interview Scheduling Modal */}
      <AnimatePresence>
        {schedulingSitter && (
          <div className="fixed inset-0 z-[110] flex items-center justify-center p-4">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => {
                setSchedulingSitter(null);
                setModalError('');
              }}
              className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm"
            />
            <motion.div
              initial={{ opacity: 0, scale: 0.9, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: 20 }}
              className="relative w-full max-w-md bg-white rounded-[32px] shadow-2xl overflow-hidden"
            >
              <div className="p-8">
                <div className="flex justify-between items-center mb-6">
                  <h3 className="text-xl font-display font-bold text-slate-800">{t.modals.interview.title}</h3>
                  <button
                    onClick={() => {
                      setSchedulingSitter(null);
                      setModalError('');
                    }}
                    className="p-2 hover:bg-slate-100 rounded-full transition-colors"
                  >
                    <X size={20} className="text-slate-400" />
                  </button>
                </div>

                <div className="flex items-center gap-4 p-4 bg-slate-50 rounded-2xl mb-8 border border-slate-100">
                  <img src={schedulingSitter.photo} alt={schedulingSitter.name} className="w-14 h-14 rounded-xl object-cover" />
                  <div>
                    <h4 className="font-bold text-slate-800">{schedulingSitter.name}</h4>
                    <p className="text-xs text-slate-500">{schedulingSitter.experience} {t.modals.profile.yearsExp.toLowerCase()} {t.modals.profile.experience.toLowerCase()}</p>
                  </div>
                </div>

                <div className="space-y-6">
                  <div className="flex items-center justify-between p-4 bg-brand-blue/10 rounded-2xl border border-brand-blue/20">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 bg-white rounded-lg flex items-center justify-center text-brand-accent shadow-sm">
                        <Video size={18} />
                      </div>
                      <div>
                        <p className="text-xs font-bold text-slate-800">{t.modals.interview.skip}</p>
                        <p className="text-[10px] text-slate-500">{t.modals.interview.skipSubtitle}</p>
                      </div>
                    </div>
                    <button
                      onClick={() => setModalInterviewConfig(prev => ({ ...prev, skipped: !prev.skipped }))}
                      className={`w-12 h-6 rounded-full relative transition-colors duration-300 ${modalInterviewConfig.skipped ? 'bg-brand-accent' : 'bg-slate-300'
                        }`}
                    >
                      <motion.div
                        animate={{ x: modalInterviewConfig.skipped ? 24 : 4 }}
                        className="absolute top-1 w-4 h-4 bg-white rounded-full shadow-sm"
                      />
                    </button>
                  </div>

                  <AnimatePresence>
                    {!modalInterviewConfig.skipped && (
                      <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: 'auto', opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        className="space-y-4 overflow-hidden"
                      >
                        <div className="space-y-2">
                          <label className="text-[10px] uppercase font-bold text-slate-400">{t.modals.interview.preferredDate}</label>
                          <div className="relative">
                            <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 text-brand-accent" size={18} />
                            <input
                              type="date"
                              value={modalInterviewConfig.date}
                              onChange={(e) => {
                                setModalInterviewConfig(prev => ({ ...prev, date: e.target.value }));
                                setModalError('');
                              }}
                              min={new Date().toISOString().split('T')[0]}
                              className="w-full pl-10 pr-4 py-3 rounded-xl border border-slate-200 focus:ring-2 focus:ring-brand-accent/20 outline-none transition-all"
                            />
                          </div>
                        </div>
                        <div className="space-y-2">
                          <label className="text-[10px] uppercase font-bold text-slate-400">{t.modals.interview.preferredTime}</label>
                          <div className="relative">
                            <Clock className="absolute left-3 top-1/2 -translate-y-1/2 text-brand-accent" size={18} />
                            <select
                              value={modalInterviewConfig.time}
                              onChange={(e) => setModalInterviewConfig(prev => ({ ...prev, time: e.target.value }))}
                              className="w-full pl-10 pr-4 py-3 rounded-xl border border-slate-200 focus:ring-2 focus:ring-brand-accent/20 outline-none transition-all appearance-none"
                            >
                              {['09:00', '10:00', '11:00', '14:00', '15:00', '16:00', '17:00'].map(t => (
                                <option key={t} value={t}>{t}</option>
                              ))}
                            </select>
                          </div>
                          <p className="text-[10px] text-slate-400 flex items-center gap-1">
                            <Info size={10} /> {t.modals.interview.timezone}
                          </p>
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>

                  {modalError && (
                    <div className="p-3 bg-red-50 border border-red-100 rounded-xl flex items-center gap-2 text-red-600 text-xs font-medium">
                      <AlertCircle size={14} />
                      {modalError}
                    </div>
                  )}

                  <div className="flex gap-3 pt-4">
                    <button
                      onClick={() => {
                        setSchedulingSitter(null);
                        setModalError('');
                      }}
                      className="flex-1 py-3 px-4 rounded-xl border border-slate-200 text-slate-500 font-bold text-sm hover:bg-slate-50 transition-colors"
                    >
                      {t.common.back}
                    </button>
                    <button
                      onClick={confirmCandidateSelection}
                      className="flex-[2] py-3 px-4 bg-brand-accent hover:bg-[#66B2AC] text-white font-bold text-sm rounded-xl shadow-lg shadow-brand-accent/20 transition-all"
                    >
                      {t.modals.interview.confirm}
                    </button>
                  </div>
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Profile Modal */}
      <AnimatePresence>
        {viewingBabysitter && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-slate-900/60 backdrop-blur-md flex items-center justify-center z-[100] p-4"
            onClick={() => setViewingBabysitter(null)}
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0, y: 20 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.9, opacity: 0, y: 20 }}
              className="bg-white rounded-[40px] max-w-2xl w-full overflow-hidden shadow-2xl relative"
              onClick={(e) => e.stopPropagation()}
            >
              <button
                onClick={() => setViewingBabysitter(null)}
                className="absolute top-6 right-6 p-2 bg-slate-100 hover:bg-slate-200 rounded-full transition-colors z-10"
              >
                <X size={20} className="text-slate-500" />
              </button>

              <div className="flex flex-col md:flex-row">
                <div className="md:w-2/5 relative">
                  <img
                    src={viewingBabysitter.photo.replace('200/200', '600/800')}
                    alt={viewingBabysitter.name}
                    className="w-full h-full object-cover min-h-[300px]"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent md:hidden" />
                  <div className="absolute bottom-6 left-6 text-white md:hidden">
                    <h2 className="text-2xl font-display font-bold">{viewingBabysitter.name}</h2>
                    <p className="text-sm opacity-90">{viewingBabysitter.age} {t.modals.profile.yearsOld}</p>
                  </div>
                </div>

                <div className="md:w-3/5 p-8 md:p-10 max-h-[80vh] overflow-y-auto">
                  <div className="hidden md:block mb-6">
                    <h2 className="text-3xl font-display font-bold text-slate-800 mb-1">{viewingBabysitter.name}</h2>
                    <div className="flex items-center gap-3">
                      <span className="text-slate-500 font-medium">{viewingBabysitter.age} {t.modals.profile.yearsOld}</span>
                      <span className="w-1 h-1 bg-slate-300 rounded-full" />
                      <div className="flex items-center gap-1">
                        <Star size={14} className="text-amber-400 fill-amber-400" />
                        <span className="font-bold text-slate-700">{viewingBabysitter.rating}</span>
                        <span className="text-slate-400 text-sm">({viewingBabysitter.reviews} {t.common.reviews})</span>
                      </div>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-4 mb-8">
                    <div className="bg-slate-50 p-4 rounded-2xl border border-slate-100">
                      <p className="text-[10px] uppercase font-bold text-slate-400 mb-1">{t.modals.profile.experience}</p>
                      <p className="text-sm font-bold text-slate-800 flex items-center gap-2">
                        <Award size={16} className="text-brand-accent" /> {viewingBabysitter.experience} {t.modals.profile.yearsExp}
                      </p>
                    </div>
                    <div className="bg-slate-50 p-4 rounded-2xl border border-slate-100">
                      <p className="text-[10px] uppercase font-bold text-slate-400 mb-1">{t.modals.profile.languages}</p>
                      <div className="flex flex-wrap gap-1">
                        {viewingBabysitter.languages.map(l => (
                          <span key={l} className="text-[10px] font-bold text-brand-accent">{l}</span>
                        ))}
                      </div>
                    </div>
                  </div>

                  <div className="space-y-6">
                    <div>
                      <h4 className="text-sm font-bold text-slate-800 mb-2 flex items-center gap-2">
                        <UserIcon size={16} className="text-brand-accent" /> {t.modals.profile.aboutMe}
                      </h4>
                      <p className="text-sm text-slate-600 leading-relaxed">
                        {viewingBabysitter.fullBio}
                      </p>
                    </div>

                    <div className="pt-6 border-t border-slate-100">
                      {selectedCandidates.some(c => c.sitterId === viewingBabysitter.id) ? (
                        <button
                          onClick={() => {
                            removeCandidate(viewingBabysitter.id);
                            setViewingBabysitter(null);
                          }}
                          className="w-full py-4 rounded-2xl font-bold bg-red-50 text-red-500 hover:bg-red-100 transition-all"
                        >
                          {t.common.remove}
                        </button>
                      ) : (
                        <button
                          onClick={() => {
                            setSchedulingSitter(viewingBabysitter);
                            setViewingBabysitter(null);
                          }}
                          disabled={selectedCandidates.length >= 4}
                          className={`w-full py-4 rounded-2xl font-bold transition-all ${selectedCandidates.length >= 4
                            ? 'bg-slate-100 text-slate-400 cursor-not-allowed'
                            : 'bg-brand-accent text-white hover:bg-[#66B2AC] shadow-lg shadow-brand-accent/20'
                            }`}
                        >
                          {selectedCandidates.length >= 4 ? t.step4.maxCandidates : t.step4.selectCandidate}
                        </button>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Sticky Footer Message */}
      <div className="mt-12 text-center">
        <p className="text-slate-400 text-sm flex items-center justify-center gap-2">
          {t.footer.assistance}
        </p>
      </div>

      {/* WhatsApp Floating Button */}
      <motion.button
        whileHover={{ scale: 1.1, rotate: 5 }}
        whileTap={{ scale: 0.9 }}
        className="fixed bottom-8 right-8 w-14 h-14 bg-[#25D366] text-white rounded-full shadow-xl flex items-center justify-center z-50"
        onClick={() => window.open('https://wa.me/1234567890', '_blank')}
      >
        <MessageCircle size={28} fill="currentColor" />
      </motion.button>

      {/* Success Modal (Mock) */}
      <AnimatePresence>
        {isSubmitted && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="fixed inset-0 bg-slate-900/40 backdrop-blur-sm flex items-center justify-center z-[100] p-4"
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              className="bg-white rounded-[32px] p-8 max-w-sm w-full text-center shadow-2xl"
            >
              <div className="w-20 h-20 bg-brand-blue rounded-full flex items-center justify-center mx-auto mb-6">
                <Baby size={40} className="text-brand-accent" />
              </div>
              <h2 className="text-2xl font-display font-bold text-slate-800 mb-2">{t.modals.success.title}</h2>
              <p className="text-slate-500 mb-8">{t.modals.success.subtitle}</p>
              <button
                onClick={() => {
                  setIsSubmitted(false);
                  setCurrentStep(1);
                  setSelectedCandidates([]);
                  setSchedulingSitter(null);
                  setModalInterviewConfig({ date: '', time: '10:00', skipped: false });
                  setIsPaymentSuccess(false);
                }}
                className="w-full bg-brand-accent text-white font-bold py-3 rounded-xl hover:bg-[#66B2AC] transition-colors"
              >
                {t.modals.success.backToStart}
              </button>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
