import { get } from "react-native/Libraries/TurboModule/TurboModuleRegistry";


const users = [
    {
      id: 1,
      user_key: "USER12345",
      owner_legal_name: "Ravi Kumar",
      business_name: "Kumar Enterprises",
      mobile_number: "+916201881238",
      email: "john.doe@example.com",
      otp: "123456",
      pan_no: "ABCDE1234F",
      tan_no: "TAN1234567",
      adhar_no: "123412341234",
      address: "123 Main Street, New Delhi, India",
      avatar: "https://example.com/avatar1.jpg",
      adhar_front_pic: "https://example.com/adhar_front1.jpg",
      adhar_back_pic: "https://example.com/adhar_back1.jpg",
      pan_pic: "https://example.com/pan_pic1.jpg",
      tan_pic: "https://example.com/tan_pic1.jpg",
      google_id: null,
      otp_expiry_date: "2025-04-10T12:00:00Z",
      status: "Completed",
      role: "user",
      login_method: "mobile_otp",
      created_at: "2025-04-01T10:00:00Z",
      update_at: "2025-04-01T10:00:00Z",
      updated_by: 0,
      isLoggedIn: 1,
      password: null,
      isApproved: 0,
    },
    {
      id: 2,
      user_key: "USER67890",
      owner_legal_name: "Jane Smith",
      business_name: "Smith Ventures",
      mobile_number: "9708571269",
      email: "jane.smith@example.com",
      otp: "654321",
      pan_no: "FGHIJ5678K",
      tan_no: "TAN7654321",
      adhar_no: "432143214321",
      address: "456 Market Street, Mumbai, India",
      avatar: "https://example.com/avatar2.jpg",
      adhar_front_pic: "https://example.com/adhar_front2.jpg",
      adhar_back_pic: "https://example.com/adhar_back2.jpg",
      pan_pic: "https://example.com/pan_pic2.jpg",
      tan_pic: "https://example.com/tan_pic2.jpg",
      google_id: null,
      otp_expiry_date: "2025-04-10T12:00:00Z",
      status: "Completed",
      role: "vendor",
      login_method: "mobile_otp",
      created_at: "2025-04-01T10:00:00Z",
      update_at: "2025-04-01T10:00:00Z",
      updated_by: 0,
      isLoggedIn: 0,
      password: null,
      isApproved: 1,
    },
    {
      id: 3,
      user_key: "ADMIN001",
      owner_legal_name: "Admin User",
      business_name: null,
      mobile_number: "+919999999999",
      email: "admin@example.com",
      otp: "999999",
      pan_no: null,
      tan_no: null,
      adhar_no: null,
      address: "Admin Office, Bengaluru, India",
      avatar: "https://example.com/avatar3.jpg",
      adhar_front_pic: null,
      adhar_back_pic: null,
      pan_pic: null,
      tan_pic: null,
      google_id: null,
      otp_expiry_date: "2025-04-10T12:00:00Z",
      status: "Active",
      role: "admin",
      login_method: "email_password",
      created_at: "2025-04-01T10:00:00Z",
      update_at: "2025-04-01T10:00:00Z",
      updated_by: 0,
      isLoggedIn: 1,
      password: "securepassword",
      isApproved: 0,
    },
  ];

const get4DigitRandomNumber = () => {
    return Math.floor(1000 + Math.random() * 9000).toString(); // Generate a random 4-digit number
}
const getotp = () => {
    return Math.floor(100000 + Math.random() * 900000).toString(); // Generate a random 6-digit OTP
}

const findUserByPhoneNumber = (phoneNumber) => {
    return users.find((user) => user.mobile_number === phoneNumber);
}

export const LoginAPI = (phoneNumber) => {
    const user = findUserByPhoneNumber(phoneNumber);
    if (user) {

    
        user.otp = getotp();; // Update the user's OTP
        user.otp_expiry_date = new Date(Date.now() + 5 * 60 * 1000).toISOString(); // Set OTP expiry to 5 minutes from now
        
        return {
            status: 200,
            data: {
                message: "User found",
                user: user,
            },
        };
    } else {
       var  newUser = {
            id: users.length + 1,
            user_key: "USER" + get4DigitRandomNumber(),
            owner_legal_name: null,
            business_name: null,
            mobile_number: phoneNumber,
            email: null,
            otp: getotp(),
            pan_no: null,
            tan_no: null,
            adhar_no: null,
            address: null,
            avatar: null,
            adhar_front_pic: null,
            adhar_back_pic: null,
            pan_pic: null,
            tan_pic: null,
            google_id: null,
            otp_expiry_date:  new Date(Date.now() + 5 * 60 * 1000).toISOString(), // Set OTP expiry to 5 minutes from now,
            status: "New",
            role: "user",
            login_method: "mobile_otp",
            created_at: new Date().toISOString(),
            update_at: new Date().toISOString(),
            updated_by: 0,
            isLoggedIn: 0,
        };

        users.push(newUser); // Add the new user to the list
        return {
            status: 404,
            data: {
                message: "User not found",
                user: newUser,
                
            },
        };
    }
}

export const verifyOtpAPI = (phoneNumber, otp) => {
    const user = findUserByPhoneNumber(phoneNumber);
    if (user) {
        if (user.otp === otp && new Date(user.otp_expiry_date) > new Date()) {
            return {
                status: 200,
                data: {
                    message: "OTP verified successfully",
                    user: user,
                },
            };
        } else {
            return {
                status: 400,
                data: {
                    message: "Invalid OTP or OTP expired",
                },
            };
        }
    } else {
        return {
            status: 404,
            data: {
                message: "User not found",
            },
        };
    }
}

function findUserByUserKey (userKey) {
    return users.find((user) => user.user_key === userKey);
}

export const signupAPI = (data) => {   
    const user = findUserByUserKey(data.user_key);
    if (user) {
        user.owner_legal_name = data.owner_legal_name;

        user.email = data.email;
        user.role = data.role;
        if (data.role === "user") {
            user.status = "Completed";;
        }

        user.isApproved = 0; 
        return {
            status: 200,
            data: {
                message: "User signed up successfully",
                user: user,
            },
        };
    } else {
        return {
            status: 404,
            data: {
                message: "User not found",
            },
        };
    }
}