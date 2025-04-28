import { collection, addDoc, getDocs, doc, setDoc } from 'firebase/firestore';
import { db } from '../services/firebase';

// Function to initialize the database with seed data
export const initializeDatabase = async () => {
  try {
    console.log('Checking initialization status...');
    
    // Check if database is already initialized
    const systemDoc = doc(db, 'system', 'initialized');
    
    // Add sectors
    await addSectors();
    
    // Add states
    const stateRefs = await addStates();
    
    // Add districts
    await addDistricts(stateRefs);

    // Create transactionLogs collection with appropriate indexes
    await setupTransactionLogs();
    
    // Mark database as initialized
    await setDoc(systemDoc, {
      initialized: true,
      timestamp: new Date()
    });
    
    console.log('Database initialization completed successfully!');
    return true;
  } catch (error) {
    console.error('Error initializing database:', error);
    return false;
  }
};

// Add sectors
const addSectors = async () => {
  const sectorsCollection = collection(db, 'sectors');
  
  const sectors = [
    {
      name: "Agriculture",
      description: "Funds allocated for agricultural development",
      allocatedFunds: 0,
      utilizedFunds: 0
    },
    {
      name: "Roads",
      description: "Funds allocated for road infrastructure",
      allocatedFunds: 0,
      utilizedFunds: 0
    },
    {
      name: "Transportation",
      description: "Funds allocated for public transportation",
      allocatedFunds: 0,
      utilizedFunds: 0
    },
    {
      name: "Education",
      description: "Funds allocated for educational institutions",
      allocatedFunds: 0,
      utilizedFunds: 0
    },
    {
      name: "Healthcare",
      description: "Funds allocated for healthcare facilities",
      allocatedFunds: 0,
      utilizedFunds: 0
    },
    {
      name: "Development",
      description: "Funds allocated for general development",
      allocatedFunds: 0,
      utilizedFunds: 0
    }
  ];
  
  console.log('Adding sectors...');
  for (const sector of sectors) {
    await addDoc(sectorsCollection, sector);
  }
  console.log('Sectors added successfully!');
};

// Add states
const addStates = async () => {
  const statesCollection = collection(db, 'states');
  
  const states = [
    {
      name: "Andhra Pradesh",
      allocatedFunds: 0,
      utilizedFunds: 0
    },
    {
      name: "Arunachal Pradesh",
      allocatedFunds: 0,
      utilizedFunds: 0
    },
    {
      name: "Assam",
      allocatedFunds: 0,
      utilizedFunds: 0
    },
    {
      name: "Bihar",
      allocatedFunds: 0,
      utilizedFunds: 0
    },
    {
      name: "Chhattisgarh",
      allocatedFunds: 0,
      utilizedFunds: 0
    },
    {
      name: "Goa",
      allocatedFunds: 0,
      utilizedFunds: 0
    },
    {
      name: "Gujarat",
      allocatedFunds: 0,
      utilizedFunds: 0
    },
    {
      name: "Haryana",
      allocatedFunds: 0,
      utilizedFunds: 0
    },
    {
      name: "Himachal Pradesh",
      allocatedFunds: 0,
      utilizedFunds: 0
    },
    {
      name: "Jharkhand",
      allocatedFunds: 0,
      utilizedFunds: 0
    },
    {
      name: "Karnataka",
      allocatedFunds: 0,
      utilizedFunds: 0
    },
    {
      name: "Kerala",
      allocatedFunds: 0,
      utilizedFunds: 0
    },
    {
      name: "Madhya Pradesh",
      allocatedFunds: 0,
      utilizedFunds: 0
    },
    {
      name: "Maharashtra",
      allocatedFunds: 0,
      utilizedFunds: 0
    },
    {
      name: "Manipur",
      allocatedFunds: 0,
      utilizedFunds: 0
    },
    {
      name: "Meghalaya",
      allocatedFunds: 0,
      utilizedFunds: 0
    },
    {
      name: "Mizoram",
      allocatedFunds: 0,
      utilizedFunds: 0
    },
    {
      name: "Nagaland",
      allocatedFunds: 0,
      utilizedFunds: 0
    },
    {
      name: "Odisha",
      allocatedFunds: 0,
      utilizedFunds: 0
    },
    {
      name: "Punjab",
      allocatedFunds: 0,
      utilizedFunds: 0
    },
    {
      name: "Rajasthan",
      allocatedFunds: 0,
      utilizedFunds: 0
    },
    {
      name: "Sikkim",
      allocatedFunds: 0,
      utilizedFunds: 0
    },
    {
      name: "Tamil Nadu",
      allocatedFunds: 0,
      utilizedFunds: 0
    },
    {
      name: "Telangana",
      allocatedFunds: 0,
      utilizedFunds: 0
    },
    {
      name: "Tripura",
      allocatedFunds: 0,
      utilizedFunds: 0
    },
    {
      name: "Uttar Pradesh",
      allocatedFunds: 0,
      utilizedFunds: 0
    },
    {
      name: "Uttarakhand",
      allocatedFunds: 0,
      utilizedFunds: 0
    },
    {
      name: "West Bengal",
      allocatedFunds: 0,
      utilizedFunds: 0
    }
  ];
  
  console.log('Adding states...');
  const stateRefs = {};
  for (const state of states) {
    const docRef = await addDoc(statesCollection, state);
    stateRefs[state.name] = docRef.id;
  }
  console.log('States added successfully!');
  
  return stateRefs;
};

// Add districts
const addDistricts = async (stateRefs) => {
  const districtsCollection = collection(db, 'districts');
  
  // If stateRefs is not provided, get state IDs
  if (!stateRefs || Object.keys(stateRefs).length === 0) {
    const statesCollection = collection(db, 'states');
    const statesQuery = await getDocs(statesCollection);
    
    stateRefs = {};
    statesQuery.forEach(doc => {
      stateRefs[doc.data().name] = doc.id;
    });
  }
  
  const districts = [
    // Maharashtra districts
    {
      name: "Mumbai",
      stateId: stateRefs["Maharashtra"],
      allocatedFunds: 0,
      utilizedFunds: 0
    },
    {
      name: "Pune",
      stateId: stateRefs["Maharashtra"],
      allocatedFunds: 0,
      utilizedFunds: 0
    },
    {
      name: "Nagpur",
      stateId: stateRefs["Maharashtra"],
      allocatedFunds: 0,
      utilizedFunds: 0
    },
    {
      name: "Thane",
      stateId: stateRefs["Maharashtra"],
      allocatedFunds: 0,
      utilizedFunds: 0
    },
    // Karnataka districts
    {
      name: "Bangalore",
      stateId: stateRefs["Karnataka"],
      allocatedFunds: 0,
      utilizedFunds: 0
    },
    {
      name: "Mysore",
      stateId: stateRefs["Karnataka"],
      allocatedFunds: 0,
      utilizedFunds: 0
    },
    {
      name: "Hubli",
      stateId: stateRefs["Karnataka"],
      allocatedFunds: 0,
      utilizedFunds: 0
    },
    {
      name: "Mangalore",
      stateId: stateRefs["Karnataka"],
      allocatedFunds: 0,
      utilizedFunds: 0
    },
    // Tamil Nadu districts
    {
      name: "Chennai",
      stateId: stateRefs["Tamil Nadu"],
      allocatedFunds: 0,
      utilizedFunds: 0
    },
    {
      name: "Coimbatore",
      stateId: stateRefs["Tamil Nadu"],
      allocatedFunds: 0,
      utilizedFunds: 0
    },
    {
      name: "Madurai",
      stateId: stateRefs["Tamil Nadu"],
      allocatedFunds: 0,
      utilizedFunds: 0
    },
    {
      name: "Salem",
      stateId: stateRefs["Tamil Nadu"],
      allocatedFunds: 0,
      utilizedFunds: 0
    },
    // Gujarat districts
    {
      name: "Ahmedabad",
      stateId: stateRefs["Gujarat"],
      allocatedFunds: 0,
      utilizedFunds: 0
    },
    {
      name: "Surat",
      stateId: stateRefs["Gujarat"],
      allocatedFunds: 0,
      utilizedFunds: 0
    },
    {
      name: "Vadodara",
      stateId: stateRefs["Gujarat"],
      allocatedFunds: 0,
      utilizedFunds: 0
    },
    {
      name: "Rajkot",
      stateId: stateRefs["Gujarat"],
      allocatedFunds: 0,
      utilizedFunds: 0
    },
    // Telangana districts
    {
      name: "Hyderabad",
      stateId: stateRefs["Telangana"],
      allocatedFunds: 0,
      utilizedFunds: 0
    },
    {
      name: "Warangal",
      stateId: stateRefs["Telangana"],
      allocatedFunds: 0,
      utilizedFunds: 0
    },
    {
      name: "Nizamabad",
      stateId: stateRefs["Telangana"],
      allocatedFunds: 0,
      utilizedFunds: 0
    },
    // Kerala districts
    {
      name: "Thiruvananthapuram",
      stateId: stateRefs["Kerala"],
      allocatedFunds: 0,
      utilizedFunds: 0
    },
    {
      name: "Kochi",
      stateId: stateRefs["Kerala"],
      allocatedFunds: 0,
      utilizedFunds: 0
    },
    {
      name: "Kozhikode",
      stateId: stateRefs["Kerala"],
      allocatedFunds: 0,
      utilizedFunds: 0
    },
    // Andhra Pradesh districts
    { name: "Anantapur", stateId: stateRefs["Andhra Pradesh"], allocatedFunds: 0, utilizedFunds: 0 },
    { name: "Chittoor", stateId: stateRefs["Andhra Pradesh"], allocatedFunds: 0, utilizedFunds: 0 },
    { name: "East Godavari", stateId: stateRefs["Andhra Pradesh"], allocatedFunds: 0, utilizedFunds: 0 },
    { name: "Guntur", stateId: stateRefs["Andhra Pradesh"], allocatedFunds: 0, utilizedFunds: 0 },
    { name: "Krishna", stateId: stateRefs["Andhra Pradesh"], allocatedFunds: 0, utilizedFunds: 0 },
    { name: "Kurnool", stateId: stateRefs["Andhra Pradesh"], allocatedFunds: 0, utilizedFunds: 0 },
    { name: "Prakasam", stateId: stateRefs["Andhra Pradesh"], allocatedFunds: 0, utilizedFunds: 0 },
    { name: "Srikakulam", stateId: stateRefs["Andhra Pradesh"], allocatedFunds: 0, utilizedFunds: 0 },
    { name: "Visakhapatnam", stateId: stateRefs["Andhra Pradesh"], allocatedFunds: 0, utilizedFunds: 0 },
    { name: "Vizianagaram", stateId: stateRefs["Andhra Pradesh"], allocatedFunds: 0, utilizedFunds: 0 },
    { name: "West Godavari", stateId: stateRefs["Andhra Pradesh"], allocatedFunds: 0, utilizedFunds: 0 },
    { name: "YSR Kadapa", stateId: stateRefs["Andhra Pradesh"], allocatedFunds: 0, utilizedFunds: 0 },
    
    // Maharashtra districts (adding more to existing)
    { name: "Nashik", stateId: stateRefs["Maharashtra"], allocatedFunds: 0, utilizedFunds: 0 },
    { name: "Aurangabad", stateId: stateRefs["Maharashtra"], allocatedFunds: 0, utilizedFunds: 0 },
    { name: "Ahmednagar", stateId: stateRefs["Maharashtra"], allocatedFunds: 0, utilizedFunds: 0 },
    { name: "Solapur", stateId: stateRefs["Maharashtra"], allocatedFunds: 0, utilizedFunds: 0 },
    { name: "Jalgaon", stateId: stateRefs["Maharashtra"], allocatedFunds: 0, utilizedFunds: 0 },
    { name: "Kolhapur", stateId: stateRefs["Maharashtra"], allocatedFunds: 0, utilizedFunds: 0 },
    { name: "Amravati", stateId: stateRefs["Maharashtra"], allocatedFunds: 0, utilizedFunds: 0 },
    { name: "Sangli", stateId: stateRefs["Maharashtra"], allocatedFunds: 0, utilizedFunds: 0 },
    { name: "Yavatmal", stateId: stateRefs["Maharashtra"], allocatedFunds: 0, utilizedFunds: 0 },
    { name: "Raigad", stateId: stateRefs["Maharashtra"], allocatedFunds: 0, utilizedFunds: 0 },
    
    // Karnataka districts (adding more to existing)
    { name: "Belgaum", stateId: stateRefs["Karnataka"], allocatedFunds: 0, utilizedFunds: 0 },
    { name: "Gulbarga", stateId: stateRefs["Karnataka"], allocatedFunds: 0, utilizedFunds: 0 },
    { name: "Raichur", stateId: stateRefs["Karnataka"], allocatedFunds: 0, utilizedFunds: 0 },
    { name: "Bellary", stateId: stateRefs["Karnataka"], allocatedFunds: 0, utilizedFunds: 0 },
    { name: "Bidar", stateId: stateRefs["Karnataka"], allocatedFunds: 0, utilizedFunds: 0 },
    { name: "Mandya", stateId: stateRefs["Karnataka"], allocatedFunds: 0, utilizedFunds: 0 },
    { name: "Tumkur", stateId: stateRefs["Karnataka"], allocatedFunds: 0, utilizedFunds: 0 },
    { name: "Hassan", stateId: stateRefs["Karnataka"], allocatedFunds: 0, utilizedFunds: 0 },
    { name: "Chitradurga", stateId: stateRefs["Karnataka"], allocatedFunds: 0, utilizedFunds: 0 },
    { name: "Shimoga", stateId: stateRefs["Karnataka"], allocatedFunds: 0, utilizedFunds: 0 },
    
    // Tamil Nadu districts (adding more to existing)
    { name: "Tiruchirappalli", stateId: stateRefs["Tamil Nadu"], allocatedFunds: 0, utilizedFunds: 0 },
    { name: "Tirunelveli", stateId: stateRefs["Tamil Nadu"], allocatedFunds: 0, utilizedFunds: 0 },
    { name: "Tiruppur", stateId: stateRefs["Tamil Nadu"], allocatedFunds: 0, utilizedFunds: 0 },
    { name: "Erode", stateId: stateRefs["Tamil Nadu"], allocatedFunds: 0, utilizedFunds: 0 },
    { name: "Vellore", stateId: stateRefs["Tamil Nadu"], allocatedFunds: 0, utilizedFunds: 0 },
    { name: "Thanjavur", stateId: stateRefs["Tamil Nadu"], allocatedFunds: 0, utilizedFunds: 0 },
    { name: "Dindigul", stateId: stateRefs["Tamil Nadu"], allocatedFunds: 0, utilizedFunds: 0 },
    { name: "Kancheepuram", stateId: stateRefs["Tamil Nadu"], allocatedFunds: 0, utilizedFunds: 0 },
    { name: "Cuddalore", stateId: stateRefs["Tamil Nadu"], allocatedFunds: 0, utilizedFunds: 0 },
    { name: "Thoothukudi", stateId: stateRefs["Tamil Nadu"], allocatedFunds: 0, utilizedFunds: 0 },
    
    // Gujarat districts (adding more to existing)
    { name: "Bhavnagar", stateId: stateRefs["Gujarat"], allocatedFunds: 0, utilizedFunds: 0 },
    { name: "Jamnagar", stateId: stateRefs["Gujarat"], allocatedFunds: 0, utilizedFunds: 0 },
    { name: "Junagadh", stateId: stateRefs["Gujarat"], allocatedFunds: 0, utilizedFunds: 0 },
    { name: "Gandhinagar", stateId: stateRefs["Gujarat"], allocatedFunds: 0, utilizedFunds: 0 },
    { name: "Kutch", stateId: stateRefs["Gujarat"], allocatedFunds: 0, utilizedFunds: 0 },
    { name: "Anand", stateId: stateRefs["Gujarat"], allocatedFunds: 0, utilizedFunds: 0 },
    { name: "Bharuch", stateId: stateRefs["Gujarat"], allocatedFunds: 0, utilizedFunds: 0 },
    { name: "Mehsana", stateId: stateRefs["Gujarat"], allocatedFunds: 0, utilizedFunds: 0 },
    { name: "Valsad", stateId: stateRefs["Gujarat"], allocatedFunds: 0, utilizedFunds: 0 },
    
    // Telangana districts (adding more to existing)
    { name: "Rangareddy", stateId: stateRefs["Telangana"], allocatedFunds: 0, utilizedFunds: 0 },
    { name: "Medchal-Malkajgiri", stateId: stateRefs["Telangana"], allocatedFunds: 0, utilizedFunds: 0 },
    { name: "Karimnagar", stateId: stateRefs["Telangana"], allocatedFunds: 0, utilizedFunds: 0 },
    { name: "Khammam", stateId: stateRefs["Telangana"], allocatedFunds: 0, utilizedFunds: 0 },
    { name: "Nalgonda", stateId: stateRefs["Telangana"], allocatedFunds: 0, utilizedFunds: 0 },
    { name: "Mahbubnagar", stateId: stateRefs["Telangana"], allocatedFunds: 0, utilizedFunds: 0 },
    { name: "Adilabad", stateId: stateRefs["Telangana"], allocatedFunds: 0, utilizedFunds: 0 },
    
    // Kerala districts (adding more to existing)
    { name: "Thrissur", stateId: stateRefs["Kerala"], allocatedFunds: 0, utilizedFunds: 0 },
    { name: "Kollam", stateId: stateRefs["Kerala"], allocatedFunds: 0, utilizedFunds: 0 },
    { name: "Palakkad", stateId: stateRefs["Kerala"], allocatedFunds: 0, utilizedFunds: 0 },
    { name: "Malappuram", stateId: stateRefs["Kerala"], allocatedFunds: 0, utilizedFunds: 0 },
    { name: "Kannur", stateId: stateRefs["Kerala"], allocatedFunds: 0, utilizedFunds: 0 },
    { name: "Alappuzha", stateId: stateRefs["Kerala"], allocatedFunds: 0, utilizedFunds: 0 },
    { name: "Kottayam", stateId: stateRefs["Kerala"], allocatedFunds: 0, utilizedFunds: 0 },
    { name: "Idukki", stateId: stateRefs["Kerala"], allocatedFunds: 0, utilizedFunds: 0 },
    { name: "Pathanamthitta", stateId: stateRefs["Kerala"], allocatedFunds: 0, utilizedFunds: 0 },
    { name: "Wayanad", stateId: stateRefs["Kerala"], allocatedFunds: 0, utilizedFunds: 0 },
    { name: "Kasaragod", stateId: stateRefs["Kerala"], allocatedFunds: 0, utilizedFunds: 0 }
  ];
  
  console.log('Adding districts...');
  for (const district of districts) {
    await addDoc(districtsCollection, district);
  }
  console.log('Districts added successfully!');
};

// Add transaction logs collection and indexes
const setupTransactionLogs = async () => {
  try {
    // Create the collection with a dummy document to ensure it exists
    const logsCollection = collection(db, 'transactionLogs');
    await addDoc(logsCollection, {
      transactionId: 'INIT',
      userId: 'SYSTEM',
      userEmail: 'system@example.com',
      action: 'initialize',
      details: { message: 'Collection initialized' },
      timestamp: new Date(),
      _deleted: true // Mark as deleted so it won't show in queries
    });
    
    console.log('Transaction logs collection setup completed!');
  } catch (error) {
    console.error('Error setting up transaction logs:', error);
    throw error;
  }
};
