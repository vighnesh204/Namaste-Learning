require('dotenv').config();
const mongoose = require('mongoose');

const User = require('../models/user');
const Course = require('../models/course');
const Category = require('../models/category');
const Section = require('../models/section');
const SubSection = require('../models/subSection');

// ============================================================
// Helper: create SubSections and return their IDs
// ============================================================
async function createSubSections(lessons) {
    const ids = [];
    for (const lesson of lessons) {
        const sub = await SubSection.create({
            title: lesson.title,
            timeDuration: lesson.duration,
            description: lesson.description,
            videoUrl: lesson.videoUrl,
        });
        ids.push(sub._id);
    }
    return ids;
}

// ============================================================
// Helper: create one Section with nested SubSections
// ============================================================
async function createSection(sectionName, lessons) {
    const subSectionIds = await createSubSections(lessons);
    const section = await Section.create({
        sectionName,
        subSection: subSectionIds,
    });
    return section._id;
}

// ============================================================
// Main seed function
// ============================================================
async function seedCourses() {
    try {
        if (!process.env.DATABASE_URL) throw new Error('DATABASE_URL missing in .env');

        await mongoose.connect(process.env.DATABASE_URL);
        console.log('✅ Connected to MongoDB.');

        // --- Find (or create) category ---
        let category = await Category.findOne({ name: 'Web Development' });
        if (!category) {
            category = await Category.create({
                name: 'Web Development',
                description: 'Learn to build modern scalable web applications.',
            });
            console.log('📁 Created "Web Development" category.');
        }

        // --- Find instructor ---
        let instructor = await User.findOne({ accountType: 'Instructor' });
        if (!instructor) {
            console.error('❌ No Instructor found. Please run the main seed first: npm run seed --prefix backend');
            process.exit(1);
        }
        console.log(`👤 Using instructor: ${instructor.firstName} ${instructor.lastName} (${instructor.email})`);

        // =========================================================
        // COURSE 1: The Ultimate MERN Stack Bootcamp
        // =========================================================
        const mernSections = [
            await createSection('Backend Mastery', [
                {
                    title: 'Node.js & Express.js Foundations',
                    duration: '45:00',
                    description: 'Deep dive into Node.js event loop, Express routing, and middleware patterns.',
                    videoUrl: 'https://www.youtube.com/watch?v=Oe421EPjeBE',
                },
                {
                    title: 'MongoDB & Mongoose ORM',
                    duration: '52:00',
                    description: 'Schema design, indexing strategies, aggregation pipelines, and Mongoose virtuals.',
                    videoUrl: 'https://www.youtube.com/watch?v=fbYExfeFsI0',
                },
            ]),
            await createSection('Frontend Brilliance', [
                {
                    title: 'React 18 & Concurrent Features',
                    duration: '40:00',
                    description: 'Explore React 18 Suspense, useTransition, useDeferredValue, and Server Components.',
                    videoUrl: 'https://www.youtube.com/watch?v=lDLQA6lQSFg',
                },
                {
                    title: 'Redux Toolkit & RTK Query',
                    duration: '38:00',
                    description: 'Global state management with Redux Toolkit slices, thunks, and RTK Query caching.',
                    videoUrl: 'https://www.youtube.com/watch?v=9zySeP5vH9c',
                },
            ]),
        ];

        const course1 = await Course.create({
            courseName: 'The Ultimate MERN Stack Bootcamp',
            courseDescription: 'A production-grade masterclass covering MongoDB, Express.js, React 18, and Node.js. Build real-world applications with industry best practices, clean architecture, and modern tooling.',
            instructor: instructor._id,
            whatYouWillLearn: 'Build full-stack MERN apps from scratch\nDesign scalable REST APIs\nMaster Redux state management\nDeploy to production on AWS/Vercel',
            price: 4999,
            thumbnail: 'https://images.unsplash.com/photo-1633356122544-f134324a6cee?w=800&q=80',
            tag: ['MERN', 'React', 'Node.js', 'MongoDB', 'Fullstack'],
            category: category._id,
            courseContent: mernSections,
            instructions: ['Basic JavaScript knowledge required', 'Node.js installed on your machine', 'Enthusiasm to build real projects'],
            status: 'Published',
            createdAt: new Date(),
        });
        await User.findByIdAndUpdate(instructor._id, { $push: { courses: course1._id } });
        await Category.findByIdAndUpdate(category._id, { $addToSet: { courses: course1._id } });
        console.log(`✅ Course 1 created: "${course1.courseName}" — ₹${course1.price}`);

        // =========================================================
        // COURSE 2: Next.js 14 Premium Dashboard
        // =========================================================
        const nextjsSections = [
            await createSection('Server Components Deep Dive', [
                {
                    title: 'Understanding React Server Components',
                    duration: '35:00',
                    description: 'The paradigm shift: RSC vs Client Components, when to use each, and performance implications.',
                    videoUrl: 'https://www.youtube.com/watch?v=2Ggf45daK7k',
                },
                {
                    title: 'Next.js 14 App Router & Layouts',
                    duration: '42:00',
                    description: 'Nested layouts, parallel routes, intercepting routes, and loading/error boundaries.',
                    videoUrl: 'https://www.youtube.com/watch?v=wm5gMKuwSYk',
                },
                {
                    title: 'Server Actions & Data Mutations',
                    duration: '30:00',
                    description: 'Form submissions with Server Actions, optimistic updates, and cache revalidation strategies.',
                    videoUrl: 'https://www.youtube.com/watch?v=9L77QExPmI0',
                },
            ]),
        ];

        const course2 = await Course.create({
            courseName: 'Next.js 14 Premium Dashboard',
            courseDescription: 'Build a premium SaaS dashboard using Next.js 14 App Router, Server Components, Server Actions, and Shadcn/UI. Production-ready patterns for enterprise applications.',
            instructor: instructor._id,
            whatYouWillLearn: 'Master Next.js 14 App Router architecture\nBuild with React Server Components\nImplement Server Actions for mutations\nCreate beautiful dashboards with Shadcn/UI',
            price: 2999,
            thumbnail: 'https://images.unsplash.com/photo-1551650975-87deedd944c3?w=800&q=80',
            tag: ['Next.js', 'React', 'Dashboard', 'SaaS', 'TypeScript'],
            category: category._id,
            courseContent: nextjsSections,
            instructions: ['Familiarity with React hooks', 'Basic TypeScript knowledge helpful', 'VSCode recommended'],
            status: 'Published',
            createdAt: new Date(),
        });
        await User.findByIdAndUpdate(instructor._id, { $push: { courses: course2._id } });
        await Category.findByIdAndUpdate(category._id, { $addToSet: { courses: course2._id } });
        console.log(`✅ Course 2 created: "${course2.courseName}" — ₹${course2.price}`);

        // =========================================================
        // COURSE 3: Advanced UI with Framer Motion
        // =========================================================
        const framerSections = [
            await createSection('Complex Animations', [
                {
                    title: 'Variants, Orchestration & Staggering',
                    duration: '28:00',
                    description: 'Deep dive into Framer Motion variants, parent-child propagation, staggerChildren, and delayChildren for cinematic UI sequences.',
                    videoUrl: 'https://www.youtube.com/watch?v=2V1WK-3HQNk',
                },
                {
                    title: 'Gestures, Drag & Scroll Animations',
                    duration: '33:00',
                    description: 'Build interactive drag interfaces, scroll-linked animations with useScroll, and physics-based spring transitions.',
                    videoUrl: 'https://www.youtube.com/watch?v=ukuFxRxD0KA',
                },
            ]),
        ];

        const course3 = await Course.create({
            courseName: 'Advanced UI with Framer Motion',
            courseDescription: 'Elevate your React UIs from functional to cinematic. Master Framer Motion\'s full API — variants, gestures, scroll animations, layout transitions, and shared element animations.',
            instructor: instructor._id,
            whatYouWillLearn: 'Create cinematic animation sequences\nBuild drag-and-drop interfaces\nImplement scroll-linked parallax effects\nAnimate route transitions in Next.js',
            price: 1999,
            thumbnail: 'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=800&q=80',
            tag: ['Framer Motion', 'Animations', 'React', 'UI/UX', 'CSS'],
            category: category._id,
            courseContent: framerSections,
            instructions: ['React knowledge required', 'Tailwind CSS basics helpful', 'Creative mindset welcome'],
            status: 'Published',
            createdAt: new Date(),
        });
        await User.findByIdAndUpdate(instructor._id, { $push: { courses: course3._id } });
        await Category.findByIdAndUpdate(category._id, { $addToSet: { courses: course3._id } });
        console.log(`✅ Course 3 created: "${course3.courseName}" — ₹${course3.price}`);

        console.log('\n🚀 All 3 premium courses seeded successfully!');
        console.log('📊 Summary:');
        console.log('   → MERN Stack Bootcamp     : 2 Sections, 4 SubSections — ₹4999');
        console.log('   → Next.js 14 Dashboard    : 1 Section,  3 SubSections — ₹2999');
        console.log('   → Framer Motion UI        : 1 Section,  2 SubSections — ₹1999');
        console.log('\n🌐 Refresh your Home Page to see these courses in the sliders!');

        process.exit(0);
    } catch (error) {
        console.error('❌ Seeding failed:', error.message);
        process.exit(1);
    }
}

seedCourses();
