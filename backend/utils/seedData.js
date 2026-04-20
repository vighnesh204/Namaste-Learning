require('dotenv').config(); // Load backend/.env assuming we run from backend/

const mongoose = require('mongoose');
const bcrypt = require('bcrypt');

const User = require('../models/user');
const Profile = require('../models/profile');
const Course = require('../models/course');
const Category = require('../models/category');

async function seed() {
    try {
        if (!process.env.DATABASE_URL) {
            throw new Error("DATABASE_URL is missing in .env");
        }
        
        await mongoose.connect(process.env.DATABASE_URL);
        console.log("✅ Database Connected. Clearing existing dummy data...");
        
        // Clean Sync: Warning this drops existing collections!
        await User.deleteMany({});
        await Profile.deleteMany({});
        await Course.deleteMany({});
        await Category.deleteMany({});
        
        console.log("🗑️ Database wiped clean.");

        const hashedPassword = await bcrypt.hash("password123", 10);
        
        // --- 1. Populate Users ---
        const usersData = [
            { firstName: "Super", lastName: "Admin", email: "admin@studynotion.com", accountType: "Admin" },
            { firstName: "John", lastName: "Instructor", email: "instructor1@studynotion.com", accountType: "Instructor" },
            { firstName: "Jane", lastName: "Teacher", email: "instructor2@studynotion.com", accountType: "Instructor" },
            { firstName: "Alice", lastName: "Student", email: "student1@studynotion.com", accountType: "Student" },
            { firstName: "Bob", lastName: "Learner", email: "student2@studynotion.com", accountType: "Student" }
        ];
        
        const createdUsers = [];
        for (const u of usersData) {
            const profile = await Profile.create({ gender: null, dateOfBirth: null, about: `I am a ${u.accountType} eager to participate.`, contactNumber: null });
            const user = await User.create({
                firstName: u.firstName,
                lastName: u.lastName,
                email: u.email,
                password: hashedPassword,
                accountType: u.accountType,
                approved: true,
                additionalDetails: profile._id,
                image: `https://api.dicebear.com/5.x/initials/svg?seed=${u.firstName}%20${u.lastName}`
            });
            createdUsers.push(user);
        }
        console.log(`👤 Created ${createdUsers.length} Test Users. (Password: password123)`);
        
        const instructors = createdUsers.filter(u => u.accountType === "Instructor");
        
        // --- 2. Populate Categories ---
        const cats = [
            { name: "Web Development", description: "Learn to build modern scalable web applications." },
            { name: "Artificial Intelligence", description: "Master the algorithms behind cutting-edge AI." },
            { name: "Data Science", description: "Analyze robust datasets and build insightful predictive models." }
        ];
        const createdCategories = await Category.insertMany(cats);
        console.log(`📁 Created ${createdCategories.length} Categories.`);
        
        // --- 3. Populate 10 Courses ---
        const coursesData = [
            { catIndex: 0, title: "React Native Mobile Mastery", price: 4990, img: "https://images.unsplash.com/photo-1555066931-4365d14bab8c?w=800" },
            { catIndex: 0, title: "Fullstack NextJS BootCamp", price: 7990, img: "https://images.unsplash.com/photo-1633356122544-f134324a6cee?w=800" },
            { catIndex: 0, title: "UI/UX with CSS Animations Pro", price: 2990, img: "https://images.unsplash.com/photo-1507721999472-8ed4421c4af2?w=800" },
            { catIndex: 0, title: "Advanced Node.js Architecture", price: 5990, img: "https://images.unsplash.com/photo-1618477247222-ac60c2aa0d6c?w=800" },
            { catIndex: 1, title: "Machine Learning A-Z Algorithms", price: 12990, img: "https://images.unsplash.com/photo-1555255707-c07966088b7b?w=800" },
            { catIndex: 1, title: "Deep Learning with PyTorch", price: 14990, img: "https://images.unsplash.com/photo-1677442136019-21780ecad995?w=800" },
            { catIndex: 1, title: "OpenAI API & LLM Integration", price: 6990, img: "https://images.unsplash.com/photo-1620712943543-bcc4688e7485?w=800" },
            { catIndex: 2, title: "Python for Advanced Data Analytics", price: 8990, img: "https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=800" },
            { catIndex: 2, title: "Big Data Processing with Spark", price: 9990, img: "https://images.unsplash.com/photo-1504868584819-f8e8b4b6d7e3?w=800" },
            { catIndex: 2, title: "Tableau Executive Visualization", price: 3990, img: "https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=800" }
        ];
        
        let courseCount = 0;
        for (const data of coursesData) {
            // Randomly select one of our test instructors
            const inst = instructors[Math.floor(Math.random() * instructors.length)];
            const category = createdCategories[data.catIndex];
            
            const newCourse = await Course.create({
                courseName: data.title,
                courseDescription: `A comprehensive, step-by-step masterclass covering everything you need to know about ${data.title}. Designed for future professionals.`,
                instructor: inst._id,
                whatYouWillLearn: "Industry standards, Production-ready coding capabilities, Advanced architecture.",
                price: data.price,
                thumbnail: data.img,
                tag: [data.title.split(" ")[0], "Tech", "Programming"],
                category: category._id,
                instructions: ["Laptop required", "Basic understanding of internet infrastructure assumed"],
                status: "Published",
                createdAt: Date.now()
            });
            
            // Push connections bidirectionally
            await User.findByIdAndUpdate(inst._id, { $push: { courses: newCourse._id } });
            await Category.findByIdAndUpdate(category._id, { $push: { courses: newCourse._id } });
            courseCount++;
        }
        console.log(`📚 Created ${courseCount} Premium Courses connected to Instructors.`);
        
        console.log("🚀 Testing Data Seeding Successfully Completed!");
        process.exit(0);
        
    } catch(error) {
        console.error("❌ Error Seeding Data:", error);
        process.exit(1);
    }
}

seed();
