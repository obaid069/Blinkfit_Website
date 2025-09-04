import mongoose from 'mongoose';
import dotenv from 'dotenv';
import Blog from './models/Blog.js';
import User from './models/User.js';

dotenv.config();

const sampleBlogs = [
  {
    title: "The Complete Guide to Digital Eye Strain: Causes, Symptoms, and Solutions",
    excerpt: "Learn everything you need to know about computer vision syndrome and how to protect your eyes in the digital age.",
    content: `Digital eye strain, also known as computer vision syndrome (CVS), has become increasingly common in our screen-dominated world. As we spend more time looking at computers, smartphones, and tablets, our eyes are working harder than ever before.

## Understanding Digital Eye Strain

Digital eye strain occurs when your eyes get tired from intense use of digital devices. The American Optometric Association estimates that the average American spends over 7 hours per day looking at digital screens.

## Common Symptoms

The most common symptoms of digital eye strain include:
- Dry eyes
- Blurred vision
- Headaches
- Neck and shoulder pain
- Eye irritation
- Difficulty focusing

## The 20-20-20 Rule

One of the most effective ways to prevent digital eye strain is following the 20-20-20 rule: Every 20 minutes, look at something 20 feet away for at least 20 seconds. This simple practice can significantly reduce eye fatigue.

## Additional Prevention Tips

1. **Adjust your screen position**: Keep your screen 20-26 inches away from your eyes
2. **Use proper lighting**: Reduce glare by adjusting room lighting and screen brightness
3. **Blink more often**: Conscious blinking helps keep your eyes moist
4. **Take regular breaks**: Step away from your screen every hour
5. **Use artificial tears**: Lubricating drops can help with dry eyes

## When to See a Doctor

If symptoms persist despite following these guidelines, consult with an eye care professional. They can recommend specialized computer glasses or other treatments.`,
    author: "Dr. Emily Chen",
    category: "Eye Health",
    tags: ["digital eye strain", "computer vision", "eye care", "productivity"],
    featuredImage: "https://images.unsplash.com/photo-1559757148-5c350d0d3c56?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1950&q=80",
    readTime: 8,
    published: true,
    featured: true,
    views: 1245,
    likes: 89
  },
  {
    title: "AI-Powered Eye Care: How Technology is Revolutionizing Vision Health",
    excerpt: "Discover how artificial intelligence and computer vision are transforming the way we monitor and maintain our eye health.",
    content: `Artificial Intelligence (AI) is revolutionizing healthcare, and eye care is no exception. From early detection of eye diseases to real-time monitoring of digital habits, AI is making vision care more accessible and effective than ever before.

## AI in Eye Disease Detection

Machine learning algorithms can now detect diabetic retinopathy, glaucoma, and macular degeneration with accuracy that rivals human specialists. These systems analyze retinal images and can identify subtle changes that might be missed by the human eye.

## Real-time Blink Monitoring

Modern AI systems can track your blink rate in real-time using your device's camera. This technology helps identify when you're not blinking enough, which is a common cause of dry eyes during screen use.

## Personalized Eye Care Recommendations

AI can analyze your digital habits and provide personalized recommendations for:
- Break timing
- Exercise routines
- Environmental adjustments
- Lifestyle modifications

## The Future of AI Eye Care

As technology continues to advance, we can expect to see:
- More accurate diagnostic tools
- Predictive analytics for eye health
- Integration with smart devices
- Personalized treatment plans

## Privacy Considerations

While AI eye care offers many benefits, it's important to ensure that systems process data locally and maintain user privacy. Look for solutions that prioritize data security and transparency.`,
    author: "Dr. Michael Rodriguez",
    category: "Technology",
    tags: ["artificial intelligence", "eye care", "technology", "innovation"],
    featuredImage: "https://images.unsplash.com/photo-1582213782179-e0d53f98f2ca?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2070&q=80",
    readTime: 6,
    published: true,
    featured: true,
    views: 892,
    likes: 67
  },
  {
    title: "5 Essential Eye Exercises to Reduce Screen Fatigue",
    excerpt: "Simple yet effective eye exercises you can do anywhere to relieve digital eye strain and improve focus.",
    content: `Regular eye exercises can significantly reduce digital eye strain and improve your overall visual comfort. Here are five simple exercises you can do throughout your workday.

## 1. The Focus Change Exercise

This exercise helps improve your eye's ability to change focus:
- Hold your finger a few inches away from your eye
- Focus on your finger
- Slowly move your finger away while maintaining focus
- Look at something far away
- Focus back on your finger as you bring it back
- Repeat 10 times

## 2. Figure Eight Exercise

This exercise improves eye muscle flexibility:
- Imagine a giant figure eight about 10 feet in front of you
- Slowly trace the figure eight with your eyes
- Do this for 30 seconds, then reverse direction
- Repeat 3 times

## 3. Palm Covering

This exercise relaxes your eye muscles:
- Sit comfortably and close your eyes
- Cover your eyes with your palms
- Ensure no light enters
- Breathe deeply and relax for 30 seconds
- Slowly remove your hands

## 4. Rapid Blinking

This exercise helps lubricate your eyes:
- Blink rapidly for 20 seconds
- Close your eyes and relax for 20 seconds
- Repeat 3 times

## 5. Near and Far Focus

This exercise improves focus flexibility:
- Hold a pen at arm's length
- Focus on the pen for 15 seconds
- Focus on something 20 feet away for 15 seconds
- Return focus to the pen
- Repeat 5 times

## When to Do These Exercises

Perform these exercises:
- Every hour during screen work
- When you feel eye strain
- Before and after long work sessions
- As part of your morning routine

## Benefits You Can Expect

Regular practice can lead to:
- Reduced eye fatigue
- Better focus
- Less dry eye symptoms
- Improved visual comfort
- Better sleep quality`,
    author: "Sarah Johnson, OD",
    category: "Tips & Tricks",
    tags: ["eye exercises", "eye strain relief", "wellness", "productivity"],
    featuredImage: "https://images.unsplash.com/photo-1527613426441-4da17471b66d?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1952&q=80",
    readTime: 5,
    published: true,
    featured: false
  },
  {
    title: "Blue Light: Friend or Foe? Separating Facts from Fiction",
    excerpt: "An evidence-based look at blue light exposure from digital devices and whether blue light glasses are worth the investment.",
    content: `Blue light has become a hot topic in eye health discussions. But what does the science actually say about blue light exposure from digital devices?

## What is Blue Light?

Blue light is a portion of the visible light spectrum with wavelengths between 400-490 nanometers. It's naturally present in sunlight and artificially produced by LED screens, fluorescent lights, and digital devices.

## The Blue Light Debate

### The Concerns
- Disrupted sleep patterns
- Increased eye strain
- Potential retinal damage
- Accelerated macular degeneration

### The Reality
Current research suggests that:
- Digital devices emit relatively small amounts of blue light compared to the sun
- No conclusive evidence links device blue light to retinal damage
- Sleep disruption is more about screen use timing than blue light itself
- Eye strain is more likely caused by reduced blinking and poor viewing habits

## Blue Light Glasses: Worth It?

The effectiveness of blue light blocking glasses is debated:

### Potential Benefits:
- May improve sleep if worn 2-3 hours before bedtime
- Some users report reduced eye strain
- Possible placebo effect that encourages better screen habits

### Limitations:
- Limited scientific evidence for eye strain reduction
- May not address root causes of digital eye strain
- Quality and effectiveness vary widely between products

## Better Alternatives

Instead of relying solely on blue light glasses, consider:

1. **Screen Time Management**
   - Use device night modes
   - Reduce screen time before bed
   - Take regular breaks

2. **Environmental Changes**
   - Adjust screen brightness to match surroundings
   - Improve room lighting
   - Position screens to reduce glare

3. **Healthy Habits**
   - Follow the 20-20-20 rule
   - Blink more consciously
   - Maintain proper screen distance

## The Bottom Line

While blue light glasses may provide some benefits, they're not a magic solution for digital eye strain. A comprehensive approach focusing on good screen habits, proper lighting, and regular breaks is more effective.

## Making an Informed Decision

If you're considering blue light glasses:
- Look for products that filter 30-40% of blue light
- Choose glasses with anti-reflective coating
- Don't expect them to solve all digital eye strain issues
- Focus on overall digital wellness habits`,
    author: "Dr. James Wilson",
    category: "Eye Health",
    tags: ["blue light", "eye glasses", "science", "research"],
    featuredImage: "https://images.unsplash.com/photo-1586281380349-632531db7ed4?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2070&q=80",
    readTime: 7,
    published: true,
    featured: true
  },
  {
    title: "Creating the Perfect Home Office Setup for Eye Health",
    excerpt: "Design your workspace to minimize eye strain and maximize comfort with these evidence-based tips.",
    content: `Your home office setup plays a crucial role in your eye health. With more people working from home than ever, creating an eye-friendly workspace is essential for long-term visual comfort.

## Monitor Positioning

### Distance and Height
- Position your monitor 20-26 inches away from your eyes
- The top of your screen should be at or slightly below eye level
- Tilt the screen back 10-20 degrees to reduce neck strain

### Multiple Monitors
If using multiple monitors:
- Place the primary monitor directly in front of you
- Position secondary monitors at the same height and distance
- Use monitor arms for easy adjustment

## Lighting Considerations

### Natural Light
- Position your monitor perpendicular to windows
- Avoid having windows directly behind or in front of your screen
- Use blinds or curtains to control glare

### Artificial Lighting
- Use ambient lighting that's about half as bright as your screen
- Add task lighting for non-screen work
- Avoid overhead lights that create glare on your screen

## Screen Settings

### Brightness
- Match your screen brightness to your surroundings
- Use auto-brightness features when available
- Adjust brightness throughout the day as lighting changes

### Contrast and Text Size
- Use high contrast between text and background
- Increase text size to reduce eye strain
- Choose fonts that are easy to read

## Environmental Factors

### Humidity
- Maintain humidity levels between 40-60%
- Use a humidifier in dry climates
- Keep plants in your office to naturally increase humidity

### Air Quality
- Ensure good ventilation
- Avoid positioning workstation near air vents
- Use an air purifier if needed

## Ergonomic Considerations

### Chair and Desk Height
- Your feet should be flat on the floor
- Your arms should be parallel to the floor when typing
- Support your lower back with proper lumbar support

### Document Holders
- Use a document holder positioned at the same height as your screen
- This reduces neck movement and eye refocusing

## Technology Solutions

### Software Tools
- Use apps that remind you to take breaks
- Install blue light filtering software
- Use dark mode when available

### Hardware Additions
- Consider a monitor with flicker-free technology
- Use a monitor with adjustable color temperature
- Invest in an ergonomic keyboard and mouse

## Creating Healthy Habits

### Break Schedule
- Follow the 20-20-20 rule
- Take a 5-minute break every 30 minutes
- Step away from your desk every hour

### Eye Care Routine
- Perform eye exercises throughout the day
- Use artificial tears if needed
- Schedule regular eye exams

## Budget-Friendly Tips

You don't need expensive equipment to create an eye-friendly workspace:
- Use books to adjust monitor height
- Position a lamp to reduce glare
- Print frequently used documents to reduce screen time
- Use built-in accessibility features to increase text size

## When to Seek Professional Help

Consult an eye care professional if you experience:
- Persistent eye strain despite good habits
- Frequent headaches
- Changes in vision
- Difficulty focusing after screen use

Remember, small changes can make a big difference in your eye comfort and overall productivity.`,
    author: "Lisa Martinez, Ergonomist",
    category: "Lifestyle",
    tags: ["home office", "ergonomics", "workplace wellness", "setup"],
    featuredImage: "https://images.unsplash.com/photo-1622597467836-f3285f2131b8?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2070&q=80",
    readTime: 9,
    published: true,
    featured: false
  },
  {
    title: "The Science Behind Blinking: Why It Matters More Than You Think",
    excerpt: "Explore the fascinating science of blinking and discover why this unconscious action is crucial for eye health.",
    content: `Blinking might seem like a simple, unconscious action, but it's actually a complex process that's essential for eye health. Understanding the science behind blinking can help you better protect your vision.

## The Anatomy of a Blink

### Types of Blinking
1. **Spontaneous Blinks**: Automatic, unconscious blinks that occur regularly
2. **Reflex Blinks**: Protective responses to stimuli like bright light or objects approaching the eye
3. **Voluntary Blinks**: Conscious, intentional blinks

### The Blink Process
A complete blink involves:
- Contraction of the orbicularis oculi muscle
- Closure of the upper and lower eyelids
- Distribution of tear film across the eye surface
- Removal of debris and irritants

## Normal Blink Rates

### Average Rates
- Normal rate: 15-20 blinks per minute
- During reading: 5-10 blinks per minute
- During screen use: 3-8 blinks per minute
- During conversation: 20-25 blinks per minute

### Factors Affecting Blink Rate
- Age: Blink rates decrease with age
- Gender: Women tend to blink more than men
- Activity: Concentrated tasks reduce blink rates
- Environment: Dry air decreases blinking
- Emotional state: Stress can affect blink patterns

## The Tear Film System

### Three-Layer Structure
1. **Lipid Layer**: Prevents tear evaporation
2. **Aqueous Layer**: Provides nutrients and removes waste
3. **Mucin Layer**: Helps tears spread evenly

### Functions of Tears
- Lubricate the eye surface
- Provide nutrients to the cornea
- Remove debris and bacteria
- Maintain optical clarity
- Protect against infection

## What Happens When We Don't Blink Enough

### Immediate Effects
- Dry eye sensation
- Eye irritation
- Blurred vision
- Burning or stinging

### Long-term Consequences
- Chronic dry eye syndrome
- Corneal damage
- Increased risk of eye infections
- Vision problems

## Digital Devices and Blinking

### The Problem
Screen use significantly reduces blink rates because:
- We concentrate intensely on visual tasks
- Our eyes focus at a fixed distance
- We forget to blink naturally
- Screen glare can be inhibiting

### Research Findings
Studies show that:
- Computer users blink 60% less than normal
- Incomplete blinks are more common during screen use
- Blink quality decreases with prolonged screen time
- Recovery time after screen use varies by individual

## Improving Your Blink Health

### Conscious Blinking
- Practice deliberate, complete blinks
- Set reminders to blink throughout the day
- Do blink exercises during breaks
- Focus on slow, gentle blinks

### Environmental Modifications
- Increase humidity in your workspace
- Reduce air circulation near your face
- Use a humidifier
- Position screens to avoid glare

### The Complete Blink Technique
1. Close your eyes gently
2. Hold for a moment
3. Open slowly
4. Repeat deliberately

## Technology to the Rescue

### Blink Monitoring Apps
Modern technology can help:
- Track your blink rate in real-time
- Provide alerts when rates drop
- Offer personalized recommendations
- Monitor improvement over time

### AI-Powered Solutions
Artificial intelligence can:
- Detect incomplete blinks
- Analyze blink patterns
- Predict when breaks are needed
- Customize reminders based on your habits

## Special Considerations

### Contact Lens Wearers
- May experience reduced blink rates
- Need to be extra conscious about blinking
- Should use lubricating drops as needed
- May need to take more frequent breaks

### Age-Related Changes
- Older adults blink less frequently
- Tear production may decrease
- May need additional lubrication
- Regular eye exams become more important

## The Future of Blink Research

Emerging areas of study include:
- Blink patterns as health indicators
- Relationship between blinking and cognitive load
- Development of smart contact lenses
- Advanced tear film analysis techniques

## Practical Takeaways

To maintain healthy blinking:
1. Be aware of your blink rate during different activities
2. Practice conscious blinking exercises
3. Take regular breaks from screen work
4. Create an eye-friendly environment
5. Consider using blink monitoring technology
6. Stay hydrated and maintain overall health

Remember, something as simple as paying attention to your blinking can significantly impact your eye health and comfort throughout the day.`,
    author: "Dr. Robert Kim",
    category: "Eye Health",
    tags: ["blinking", "eye anatomy", "tear film", "research"],
    featuredImage: "https://images.unsplash.com/photo-1559757175-0eb30cd8c063?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1887&q=80",
    readTime: 10,
    published: true,
    featured: false
  }
];

function generateSlug(title) {
  return title
    .toLowerCase()
    .replace(/[^a-zA-Z0-9\s]/g, '')
    .replace(/\s+/g, '-')
    .trim();
}

// Removed admin user creation

async function seedDatabase() {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('Connected to MongoDB');
    
    // Clear existing data
    await Blog.deleteMany({});
    await User.deleteMany({ role: 'doctor' });
    console.log('Cleared existing blog and doctor data');
    
    // Add missing properties to blogs (no admin needed)
    const blogsWithSlugs = sampleBlogs.map(blog => ({
      ...blog,
      slug: generateSlug(blog.title),
      publishedAt: new Date(),
      views: blog.views || Math.floor(Math.random() * 1000) + 100,
      likes: blog.likes || Math.floor(Math.random() * 100) + 10
    }));
    
    const createdBlogs = await Blog.insertMany(blogsWithSlugs);
    console.log(`✅ Successfully seeded ${createdBlogs.length} blog posts`);
    
    createdBlogs.forEach(blog => {
      console.log(`📝 Created: "${blog.title}" (${blog.category}) - ${blog.views} views`);
    });
    
    console.log('\n🎉 Database seeding completed successfully!');
    
    process.exit(0);
  } catch (error) {
    console.error('❌ Error seeding database:', error);
    process.exit(1);
  }
}

seedDatabase();
