import mongoose from 'mongoose';
import dotenv from 'dotenv';
import Blog from './models/Blog.js';

dotenv.config();
const sampleBlogs = [
  {
    title: "Understanding Digital Eye Strain: Symptoms and Solutions",
    excerpt: "Learn about the common symptoms of digital eye strain and discover effective ways to protect your eyes while using digital devices for extended periods.",
    content: `<h2>What is Digital Eye Strain?</h2>
    <p>Digital eye strain, also known as Computer Vision Syndrome (CVS), is a condition that results from prolonged use of digital devices such as computers, smartphones, tablets, and televisions. With the increasing reliance on technology in our daily lives, more people are experiencing the discomfort associated with digital eye strain.</p>

    <h3>Common Symptoms</h3>
    <ul>
      <li><strong>Eye fatigue and discomfort:</strong> Your eyes feel tired and strained after screen use</li>
      <li><strong>Dry eyes:</strong> Reduced blinking while focusing on screens leads to eye dryness</li>
      <li><strong>Blurred vision:</strong> Difficulty focusing clearly on text or images</li>
      <li><strong>Headaches:</strong> Tension headaches from eye strain</li>
      <li><strong>Neck and shoulder pain:</strong> Poor posture while using devices</li>
    </ul>

    <h3>Prevention and Solutions</h3>
    <p>Fortunately, there are several effective strategies to combat digital eye strain:</p>

    <h4>1. The 20-20-20 Rule</h4>
    <p>Every 20 minutes, take a 20-second break and look at something 20 feet away. This simple rule helps relax the focusing muscles in your eyes.</p>

    <h4>2. Proper Lighting</h4>
    <p>Ensure your workspace has adequate lighting. The screen should not be the brightest or darkest object in your field of view.</p>

    <h4>3. Adjust Display Settings</h4>
    <p>Optimize brightness, contrast, and font size for comfortable viewing. The screen brightness should match your surrounding environment.</p>

    <h4>4. Use BlinkFit for Automated Protection</h4>
    <p>BlinkFit uses AI technology to monitor your eye health in real-time. It automatically detects signs of eye strain and prompts you to take breaks, helping prevent digital eye strain before it becomes severe.</p>

    <p>By implementing these strategies and using tools like BlinkFit, you can significantly reduce the impact of digital eye strain and maintain healthier vision in our digital age.</p>`,
    author: "Dr. Sarah Johnson",
    category: "Eye Health",
    tags: ["digital eye strain", "computer vision syndrome", "eye health", "prevention"],
    featuredImage: "https:
    readTime: 5,
    published: true,
    views: 1250,
    likes: 89,
  },
  {
    title: "How AI is Revolutionizing Eye Health Monitoring",
    excerpt: "Discover how artificial intelligence technology is transforming the way we monitor and protect our eye health, making prevention more accessible than ever.",
    content: `<h2>The Future of Eye Care is Here</h2>
    <p>Artificial Intelligence (AI) is transforming healthcare across all specialties, and ophthalmology is no exception. From early disease detection to personalized treatment plans, AI is revolutionizing how we approach eye health.</p>

    <h3>AI-Powered Eye Monitoring</h3>
    <p>Traditional eye care often focuses on reactive treatment â€“ addressing problems after they occur. AI technology enables a proactive approach by continuously monitoring eye health and detecting issues before they become serious problems.</p>

    <h4>Real-time Analysis</h4>
    <p>Modern AI systems can analyze various indicators of eye health in real-time:</p>
    <ul>
      <li>Blink rate patterns</li>
      <li>Eye movement tracking</li>
      <li>Pupil response</li>
      <li>Screen distance monitoring</li>
      <li>Usage pattern analysis</li>
    </ul>

    <h3>BlinkFit's AI Approach</h3>
    <p>BlinkFit leverages cutting-edge AI technology to provide comprehensive eye health monitoring:</p>

    <h4>Intelligent Detection</h4>
    <p>Our AI algorithms analyze your blinking patterns, eye movements, and screen interaction behaviors to identify early signs of eye strain and fatigue.</p>

    <h4>Personalized Recommendations</h4>
    <p>The system learns your unique patterns and provides personalized recommendations for break times, exercise routines, and optimal screen settings.</p>

    <h4>Predictive Analytics</h4>
    <p>By analyzing historical data, BlinkFit can predict when you're likely to experience eye strain and proactively suggest preventive measures.</p>

    <h3>Benefits of AI Eye Monitoring</h3>
    <ul>
      <li><strong>Early Detection:</strong> Identify problems before symptoms appear</li>
      <li><strong>Personalization:</strong> Tailored solutions based on individual patterns</li>
      <li><strong>Continuous Protection:</strong> 24/7 monitoring without human intervention</li>
      <li><strong>Data-Driven Insights:</strong> Evidence-based recommendations for better eye health</li>
    </ul>

    <p>As AI technology continues to advance, we can expect even more sophisticated tools for maintaining optimal eye health in our increasingly digital world.</p>`,
    author: "Tech Team BlinkFit",
    category: "Technology",
    tags: ["artificial intelligence", "ai", "eye monitoring", "technology", "innovation"],
    featuredImage: "https:
    readTime: 7,
    published: true,
    views: 892,
    likes: 124,
  },
  {
    title: "Creating an Eye-Friendly Workspace: Essential Tips",
    excerpt: "Transform your workspace into an eye-friendly environment with these practical tips and ergonomic solutions that reduce strain and improve productivity.",
    content: `<h2>Your Workspace Affects Your Eye Health</h2>
    <p>Whether you work from home or in an office, your workspace setup plays a crucial role in your eye health. A poorly designed workspace can contribute to eye strain, fatigue, and long-term vision problems.</p>

    <h3>Monitor Positioning</h3>
    <h4>Distance and Height</h4>
    <ul>
      <li>Position your monitor 20-26 inches from your eyes</li>
      <li>The top of the screen should be at or slightly below eye level</li>
      <li>Tilt the screen back 10-20 degrees</li>
    </ul>

    <h4>Multiple Monitors</h4>
    <p>If using multiple monitors, arrange them at the same distance and height. The primary monitor should be directly in front of you.</p>

    <h3>Lighting Considerations</h3>
    <h4>Ambient Lighting</h4>
    <ul>
      <li>Use indirect lighting to reduce glare</li>
      <li>Position light sources to the side of your monitor</li>
      <li>Avoid having windows directly behind or in front of your screen</li>
    </ul>

    <h4>Blue Light Management</h4>
    <p>Consider blue light filtering glasses or software that adjusts screen color temperature throughout the day.</p>

    <h3>Ergonomic Accessories</h3>
    <h4>Document Holders</h4>
    <p>Use a document holder positioned at the same distance and height as your screen to reduce head movement and refocusing.</p>

    <h4>Proper Seating</h4>
    <p>Your chair should support good posture, keeping your feet flat on the floor and your back straight.</p>

    <h3>Technology Solutions</h3>
    <p>BlinkFit can help you maintain optimal workspace conditions by:</p>
    <ul>
      <li>Monitoring your screen distance and posture</li>
      <li>Reminding you to adjust lighting when needed</li>
      <li>Providing personalized break schedules</li>
      <li>Tracking your workspace habits over time</li>
    </ul>

    <h3>Regular Maintenance</h3>
    <p>Keep your workspace eye-friendly by:</p>
    <ul>
      <li>Cleaning your screen regularly to reduce glare</li>
      <li>Adjusting settings based on time of day</li>
      <li>Evaluating and updating your setup as needed</li>
    </ul>

    <p>A well-designed workspace is an investment in your long-term eye health and overall productivity.</p>`,
    author: "Maria Rodriguez",
    category: "Lifestyle",
    tags: ["workspace", "ergonomics", "office setup", "eye health", "productivity"],
    featuredImage: "https:
    readTime: 6,
    published: true,
    views: 743,
    likes: 67,
  },
  {
    title: "10 Simple Eye Exercises to Reduce Digital Fatigue",
    excerpt: "Discover easy-to-follow eye exercises that can be done anywhere to relieve digital eye strain and improve your overall eye health throughout the day.",
    content: `<h2>Exercise Your Way to Better Eye Health</h2>
    <p>Just like any other muscle in your body, your eye muscles benefit from regular exercise. These simple exercises can help reduce digital fatigue and improve your eye comfort.</p>

    <h3>1. Palming</h3>
    <p>Cover your closed eyes with your palms for 30 seconds. This helps relax your eye muscles and provides a break from light stimulation.</p>

    <h3>2. Focus Shifting</h3>
    <p>Hold your finger about 6 inches from your face. Focus on your finger, then shift focus to an object across the room. Repeat 10 times.</p>

    <h3>3. Figure Eight Tracking</h3>
    <p>Imagine a large figure eight about 10 feet away. Trace it slowly with your eyes for 30 seconds, then reverse direction.</p>

    <h3>4. Rapid Blinking</h3>
    <p>Blink rapidly for 10-15 seconds to help lubricate your eyes and refresh your tear film.</p>

    <h3>5. Distance Gazing</h3>
    <p>Look out a window at distant objects for 20-30 seconds. This helps relax the focusing muscles.</p>

    <h3>6. Eye Rolling</h3>
    <p>Slowly roll your eyes in a circle - up, right, down, left. Repeat 5 times in each direction.</p>

    <h3>7. Zoom Focus</h3>
    <p>Extend your arm with your thumb up. Focus on your thumb as you slowly bring it closer to your nose, then back out.</p>

    <h3>8. Side-to-Side Focus</h3>
    <p>Look as far left as possible for 5 seconds, then as far right as possible. Repeat 5 times.</p>

    <h3>9. Up and Down Focus</h3>
    <p>Look up as far as possible for 5 seconds, then down. Repeat 5 times.</p>

    <h3>10. Near and Far Focus</h3>
    <p>Focus on your nose for 5 seconds, then focus on something across the room for 5 seconds. Repeat 10 times.</p>

    <h3>Creating an Exercise Routine</h3>
    <p>For best results:</p>
    <ul>
      <li>Perform these exercises 2-3 times per day</li>
      <li>Take breaks every hour for a quick exercise session</li>
      <li>Combine exercises with deep breathing for maximum relaxation</li>
    </ul>

    <h3>BlinkFit Integration</h3>
    <p>BlinkFit can remind you to perform these exercises at optimal times throughout your day, ensuring you maintain a consistent eye care routine even during busy periods.</p>

    <p>Remember, consistency is key. Regular eye exercises can significantly improve your comfort and reduce the symptoms of digital eye strain.</p>`,
    author: "Dr. Michael Chen",
    category: "Tips & Tricks",
    tags: ["eye exercises", "digital fatigue", "eye health", "wellness", "prevention"],
    featuredImage: "https:
    readTime: 4,
    published: true,
    views: 1589,
    likes: 203,
  },
  {
    title: "BlinkFit 2.0: New Features for Enhanced Eye Protection",
    excerpt: "Explore the latest features in BlinkFit 2.0, including advanced AI tracking, personalized insights, and improved user experience for better eye health management.",
    content: `<h2>Introducing BlinkFit 2.0</h2>
    <p>We're excited to announce the release of BlinkFit 2.0, packed with new features and improvements based on user feedback and the latest research in eye health technology.</p>

    <h3>Enhanced AI Detection</h3>
    <h4>Improved Accuracy</h4>
    <p>Our new AI algorithms are 40% more accurate in detecting:</p>
    <ul>
      <li>Early signs of eye fatigue</li>
      <li>Abnormal blinking patterns</li>
      <li>Poor screen distance habits</li>
      <li>Extended focus periods</li>
    </ul>

    <h4>Real-time Monitoring</h4>
    <p>BlinkFit 2.0 now provides instant feedback on your eye health status with our new real-time monitoring dashboard.</p>

    <h3>Personalized Insights</h3>
    <h4>Custom Recommendations</h4>
    <p>The app now learns from your behavior patterns to provide:</p>
    <ul>
      <li>Personalized break schedules</li>
      <li>Custom exercise routines</li>
      <li>Adaptive lighting suggestions</li>
      <li>Optimal screen settings recommendations</li>
    </ul>

    <h4>Progress Tracking</h4>
    <p>New detailed analytics show your eye health trends over time, helping you understand the effectiveness of your habits.</p>

    <h3>Smart Notifications</h3>
    <h4>Context-Aware Alerts</h4>
    <p>BlinkFit 2.0 considers your schedule and activity to provide timely, non-intrusive notifications.</p>

    <h4>Voice Alerts</h4>
    <p>New voice notification options make it easier to receive guidance without looking at your screen.</p>

    <h3>Family Protection</h3>
    <h4>Parental Controls</h4>
    <p>Parents can now monitor and manage eye health for family members under 16, with appropriate privacy controls.</p>

    <h4>Multiple Profiles</h4>
    <p>Support for multiple user profiles on the same device, each with personalized settings and tracking.</p>

    <h3>Integration Improvements</h3>
    <h4>Calendar Sync</h4>
    <p>BlinkFit can now sync with your calendar to optimize break times around your meetings and commitments.</p>

    <h4>Fitness App Integration</h4>
    <p>Connect with popular fitness apps to correlate eye health with overall wellness metrics.</p>

    <h3>User Experience Enhancements</h3>
    <ul>
      <li>Streamlined onboarding process</li>
      <li>Improved dark mode for better nighttime use</li>
      <li>Accessibility improvements for users with visual impairments</li>
      <li>Faster app performance and reduced battery usage</li>
    </ul>

    <h3>Available Now</h3>
    <p>BlinkFit 2.0 is available for download on both iOS and Android platforms. Existing users will receive a free update with all new features.</p>

    <p>We're committed to continuous improvement and appreciate your feedback as we work together to protect and enhance eye health in the digital age.</p>`,
    author: "BlinkFit Development Team",
    category: "App Features",
    tags: ["app update", "new features", "blinkfit 2.0", "ai technology", "eye protection"],
    featuredImage: "https:
    readTime: 6,
    published: true,
    views: 2104,
    likes: 298,
  },
];

const seedDatabase = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    console.log('ðŸ“¦ Connected to MongoDB');
    await Blog.deleteMany({});
    console.log('ðŸ—‘ï¸  Cleared existing blogs');
    await Blog.insertMany(sampleBlogs);
    console.log(`âœ… Successfully seeded ${sampleBlogs.length} blog posts`);
    const totalBlogs = await Blog.countDocuments();
    const publishedBlogs = await Blog.countDocuments({ published: true });
    console.log('\nðŸ“Š Database Summary:');
    console.log(`   Total blogs: ${totalBlogs}`);
    console.log(`   Published blogs: ${publishedBlogs}`);
    const categories = await Blog.distinct('category');
    console.log(`   Categories: ${categories.join(', ')}`);
    console.log('\nðŸŽ‰ Database seeding completed successfully!');
  } catch (error) {
    console.error('âŒ Error seeding database:', error);
  } finally {
    await mongoose.connection.close();
    console.log('ðŸ”Œ Database connection closed');
    process.exit(0);
  }
};

seedDatabase();
