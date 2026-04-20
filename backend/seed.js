require('dotenv').config();
const mongoose = require('mongoose');
const Category = require('./models/category');

const categories = [
    { name: "Web Development", description: "Everything from Frontend to Backend" },
    { name: "App Development", description: "Mobile app creation for iOS and Android" },
    { name: "Data Science", description: "Machine Learning, AI, and Big Data" },
    { name: "Graphic Design", description: "UI/UX and visual branding" },
    { name: "Cyber Security", description: "Network security and ethical hacking" }
];

async function seed() {
    try {
        await mongoose.connect(process.env.DATABASE_URL);
        console.log("✅ Attached to Database successfully.");
        
        console.log("🔄 Seeding Categories...");
        for (const cat of categories) {
            const exists = await Category.findOne({ name: cat.name });
            if (!exists) {
                await Category.create(cat);
                console.log(`  ➕ Created: ${cat.name}`);
            } else {
                console.log(`  ⚡ Skipped (exists): ${cat.name}`);
            }
        }
        
        console.log("\n📊 Verification: Listing all categories currently in DB:");
        const all = await Category.find({}, { name: true, description: true });
        console.log(JSON.stringify(all, null, 2));
        
        console.log("\n🚀 Seeding Complete!");
        process.exit(0);
    } catch(err) {
        console.error("❌ Seeding Error:", err);
        process.exit(1);
    }
}
seed();
