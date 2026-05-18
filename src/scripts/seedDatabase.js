require("dotenv").config();
const bcrypt = require("bcryptjs");
const { pool } = require("../config/database");
const logger = require("../utils/logger");

const seedArticleCategories = async () => {
  try {
    const categories = [
      [
        "Environmental Conservation",
        "environmental-conservation",
        "Articles about environmental protection and conservation efforts",
      ],
      [
        "Community Programs",
        "community-programs",
        "Stories about our community engagement and programs",
      ],
      [
        "Sustainability",
        "sustainability",
        "Tips and insights on sustainable living",
      ],
      [
        "News & Updates",
        "news-updates",
        "Latest news and updates from Semesta Lestari",
      ],
    ];

    for (const [name, slug, description] of categories) {
      await pool.query(
        `INSERT INTO categories (name, slug, description) VALUES (?, ?, ?) 
         ON DUPLICATE KEY UPDATE description=VALUES(description)`,
        [name, slug, description],
      );
    }

    logger.info("✅ Categories seeded");
  } catch (error) {
    logger.error("Error seeding categories:", error);
    throw error;
  }
};

const seedData = async () => {
  try {
    logger.info("Starting database seeding...");

    // Create default admin user
    const hashedPassword = await bcrypt.hash("admin123", 10);
    await pool.query(
      `INSERT INTO users (username, email, password, role, status) 
       VALUES (?, ?, ?, ?, ?) 
       ON DUPLICATE KEY UPDATE username=username`,
      ["admin", "admin@semestalestari.com", hashedPassword, "admin", "active"],
    );
    logger.info(
      "✅ Default admin user created (email: admin@semestalestari.com, password: admin123)",
    );

    // Seed hero section
    await pool.query(
      `INSERT INTO hero_sections (title, subtitle, description, button_text, button_url, button_text_2, button_url_2, is_active) 
       VALUES (?, ?, ?, ?, ?, ?, ?, ?) 
       ON DUPLICATE KEY UPDATE title=title`,
      [
        "Welcome to Semesta Lestari",
        "Building a Sustainable Future Together",
        "Join us in our mission to create positive environmental impact",
        "Learn More",
        "/about",
        "Get Involved",
        "/contact",
        true,
      ],
    );
    logger.info("✅ Hero section seeded");

    // Seed visions
    const visions = [
      [
        "Clean Environment",
        "Creating a cleaner and healthier environment for all",
        null,
        1,
      ],
      [
        "Sustainable Living",
        "Promoting sustainable lifestyle practices",
        null,
        2,
      ],
      [
        "Community Empowerment",
        "Empowering communities through education",
        null,
        3,
      ],
    ];

    for (const vision of visions) {
      await pool.query(
        `INSERT INTO visions (title, description, icon_url, order_position) VALUES (?, ?, ?, ?)`,
        vision,
      );
    }
    logger.info("✅ Visions seeded");

    // Seed missions
    const missions = [
      [
        "Environmental Education",
        "Provide comprehensive environmental education programs",
        null,
        1,
      ],
      [
        "Waste Management",
        "Implement effective waste management solutions",
        null,
        2,
      ],
      [
        "Green Initiatives",
        "Launch community-based green initiatives",
        null,
        3,
      ],
    ];

    for (const mission of missions) {
      await pool.query(
        `INSERT INTO missions (title, description, icon_url, order_position) VALUES (?, ?, ?, ?)`,
        mission,
      );
    }
    logger.info("✅ Missions seeded");

    // Seed impact sections
    const impacts = [
      ["Trees Planted", "Trees planted across communities", null, "10,000+", 1],
      [
        "Communities Reached",
        "Communities impacted by our programs",
        null,
        "50+",
        2,
      ],
      ["Volunteers", "Active volunteers supporting our cause", null, "500+", 3],
    ];

    for (const impact of impacts) {
      await pool.query(
        `INSERT INTO impact_sections (title, description, icon_url, stats_number, order_position) VALUES (?, ?, ?, ?, ?)`,
        impact,
      );
    }
    logger.info("✅ Impact sections seeded");

    // Seed impact section settings
    await pool.query(
      `INSERT INTO home_impact_section (title, subtitle, image_url, is_active) 
       VALUES (?, ?, ?, ?)`,
      ["Our Impact", "See the difference we've made together", null, true],
    );
    logger.info("✅ Impact section settings seeded");

    // Seed programs section
    await pool.query(
      `INSERT INTO home_programs_section (title, subtitle, is_active) 
       VALUES (?, ?, ?)
       ON DUPLICATE KEY UPDATE title=VALUES(title), subtitle=VALUES(subtitle)`,
      ["Our Programs", "Making a difference through various initiatives", true],
    );
    logger.info("✅ Programs section seeded");

    // Seed program categories
    const programCategories = [
      [
        "Conservation",
        "conservation",
        "Programs focused on environmental conservation and protection",
        "🌳",
        1,
      ],
      [
        "Education",
        "education",
        "Educational programs and awareness campaigns",
        "📚",
        2,
      ],
      [
        "Community",
        "community",
        "Community-based environmental initiatives",
        "👥",
        3,
      ],
      [
        "Research",
        "research",
        "Environmental research and monitoring programs",
        "🔬",
        4,
      ],
    ];

    for (const [
      name,
      slug,
      description,
      icon,
      order_position,
    ] of programCategories) {
      await pool.query(
        `INSERT INTO program_categories (name, slug, description, icon, order_position) VALUES (?, ?, ?, ?, ?)
         ON DUPLICATE KEY UPDATE description=VALUES(description), icon=VALUES(icon), order_position=VALUES(order_position)`,
        [name, slug, description, icon, order_position],
      );
    }
    logger.info("✅ Program categories seeded");

    // Seed programs
    const programs = [
      [
        "Tree Planting Initiative",
        "Planting trees across communities to combat climate change",
        null,
        1,
        true,
        1,
      ],
      [
        "Waste Management Program",
        "Implementing sustainable waste management solutions",
        null,
        3,
        false,
        2,
      ],
      [
        "Environmental Education",
        "Educating communities about environmental conservation",
        null,
        2,
        false,
        3,
      ],
    ];

    for (const [
      name,
      description,
      image_url,
      category_id,
      is_highlighted,
      order_position,
    ] of programs) {
      await pool.query(
        `INSERT INTO programs (name, description, image_url, category_id, is_highlighted, order_position) VALUES (?, ?, ?, ?, ?, ?)`,
        [
          name,
          description,
          image_url,
          category_id,
          is_highlighted,
          order_position,
        ],
      );
    }
    logger.info("✅ Programs seeded");

    // Seed statistics
    await pool.query(
      `INSERT INTO home_statistics (title, subtitle, trees_planted, volunteers, areas_covered, partners_count, is_active) 
       VALUES (?, ?, ?, ?, ?, ?, ?)`,
      [
        "Our Impact in Numbers",
        "See the difference we've made together",
        "10,000+",
        "500+",
        "25+",
        "50+",
        true,
      ],
    );
    logger.info("✅ Statistics seeded");

    // Seed donation CTA
    await pool.query(
      `INSERT INTO donation_ctas (title, description, button_text, button_url, button_text_2, button_url_2, is_active) 
       VALUES (?, ?, ?, ?, ?, ?, ?)`,
      [
        "Support Our Mission",
        "Your donation helps us create lasting environmental impact",
        "Donate Now",
        "/donate",
        "Learn More",
        "/about",
        true,
      ],
    );
    logger.info("✅ Donation CTA seeded");

    // Seed partners section
    await pool.query(
      `INSERT INTO home_partners_section (title, subtitle, image_url, is_active) 
       VALUES (?, ?, ?, ?)`,
      ["Our Partners", "Working together for a sustainable future", null, true],
    );
    logger.info("✅ Partners section seeded");

    // Seed partners
    const partners = [
      [
        "Green Earth Foundation",
        "Environmental conservation partner",
        null,
        "https://greenearth.org",
        1,
      ],
      [
        "Eco Warriors",
        "Community engagement partner",
        null,
        "https://ecowarriors.org",
        2,
      ],
      [
        "Sustainable Future Alliance",
        "Policy advocacy partner",
        null,
        "https://sustainablefuture.org",
        3,
      ],
    ];

    for (const [
      name,
      description,
      logo_url,
      website,
      order_position,
    ] of partners) {
      await pool.query(
        `INSERT INTO partners (name, description, logo_url, website, order_position) VALUES (?, ?, ?, ?, ?)`,
        [name, description, logo_url, website, order_position],
      );
    }
    logger.info("✅ Partners seeded");

    // Seed FAQ section
    await pool.query(
      `INSERT INTO home_faq_section (title, subtitle, image_url, is_active) 
       VALUES (?, ?, ?, ?)`,
      [
        "Frequently Asked Questions",
        "Find answers to common questions",
        null,
        true,
      ],
    );
    logger.info("✅ FAQ section seeded");

    // Seed FAQs
    const faqs = [
      [
        "How can I volunteer?",
        "You can volunteer by filling out our volunteer form on the contact page. We welcome volunteers of all backgrounds and skill levels.",
        "General",
        1,
      ],
      [
        "Where does my donation go?",
        "Your donations directly support our environmental programs including tree planting, waste management, and community education initiatives.",
        "Donations",
        2,
      ],
      [
        "How can I partner with Semesta Lestari?",
        "We welcome partnerships with organizations that share our vision. Please contact us through our partnership inquiry form.",
        "Partnerships",
        3,
      ],
    ];

    for (const [question, answer, category, order_position] of faqs) {
      await pool.query(
        `INSERT INTO faqs (question, answer, category, order_position) VALUES (?, ?, ?, ?)`,
        [question, answer, category, order_position],
      );
    }
    logger.info("✅ FAQs seeded");

    // Seed contact section
    await pool.query(
      `INSERT INTO home_contact_section (title, subtitle, image_url, description, address, email, phone, work_hours, is_active) 
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
       ON DUPLICATE KEY UPDATE title=VALUES(title), subtitle=VALUES(subtitle), image_url=VALUES(image_url), description=VALUES(description)`,
      [
        "Get in Touch",
        "We'd love to hear from you",
        "/uploads/contact-hero.jpg",
        "Have questions or want to get involved? We'd love to hear from you!",
        "Jl. Lingkungan Hijau No. 123, Jakarta, Indonesia",
        "info@semestalestari.com",
        "+62 21 1234 5678",
        "Monday - Friday: 9:00 AM - 5:00 PM",
        true,
      ],
    );
    logger.info("✅ Contact section seeded");

    // Seed history section
    await pool.query(
      `INSERT INTO history_section (title, subtitle, image_url, is_active) 
       VALUES (?, ?, ?, ?)`,
      ["Our History", "The journey of environmental conservation", null, true],
    );
    logger.info("✅ History section seeded");

    // Seed history
    const historyItems = [
      [
        2010,
        "Foundation",
        "The beginning of our journey",
        "Semesta Lestari was founded with a vision to create positive environmental impact in Indonesia. Our founders recognized the urgent need for environmental conservation and community-based sustainability programs.",
        "/uploads/history-2010.jpg",
        1,
      ],
      [
        2012,
        "First Programs",
        "Launching community initiatives",
        "Launched our first tree planting and environmental education programs in Jakarta and surrounding areas. Engaged with 10 local communities and planted 1,000 trees in the first year.",
        "/uploads/history-2012.jpg",
        2,
      ],
      [
        2014,
        "Partnership Growth",
        "Building strategic alliances",
        "Established partnerships with local governments and international environmental organizations. These collaborations enabled us to scale our impact and reach more communities.",
        "/uploads/history-2014.jpg",
        3,
      ],
      [
        2015,
        "Expansion",
        "Growing our reach",
        "Expanded our programs to reach 25 communities across Java and Bali, planting over 5,000 trees. Introduced waste management and recycling programs in partnership with local authorities.",
        "/uploads/history-2015.jpg",
        4,
      ],
      [
        2017,
        "Education Focus",
        "Empowering through knowledge",
        "Launched comprehensive environmental education programs in schools. Trained over 100 teachers and reached 5,000 students with our curriculum on sustainability and conservation.",
        "/uploads/history-2017.jpg",
        5,
      ],
      [
        2018,
        "Innovation Hub",
        "Technology for sustainability",
        "Established our Innovation Hub to develop technology-driven solutions for environmental challenges. Introduced mobile apps for community engagement and environmental monitoring.",
        "/uploads/history-2018.jpg",
        6,
      ],
      [
        2020,
        "Recognition",
        "National acknowledgment",
        'Received national recognition for our environmental conservation efforts and community engagement programs. Awarded "Best Environmental NGO" by the Ministry of Environment and Forestry.',
        "/uploads/history-2020.jpg",
        7,
      ],
      [
        2021,
        "COVID Response",
        "Adapting to challenges",
        "Adapted our programs during the pandemic, launching virtual environmental education and supporting communities with sustainable livelihood programs. Maintained our impact despite global challenges.",
        "/uploads/history-2021.jpg",
        8,
      ],
      [
        2022,
        "Regional Expansion",
        "Beyond Java and Bali",
        "Expanded operations to Sumatra, Kalimantan, and Sulawesi. Established regional offices and trained local teams to lead conservation efforts in their communities.",
        "/uploads/history-2022.jpg",
        9,
      ],
      [
        2023,
        "Youth Movement",
        "Engaging the next generation",
        "Launched the Youth Environmental Leaders program, training 500 young activists. Created a network of youth-led environmental initiatives across Indonesia.",
        "/uploads/history-2023.jpg",
        10,
      ],
      [
        2024,
        "Milestone",
        "A decade of impact",
        "Reached 10,000 trees planted and 500+ active volunteers supporting our mission. Celebrated 14 years of environmental stewardship with communities across Indonesia.",
        "/uploads/history-2024.jpg",
        11,
      ],
      [
        2025,
        "Future Vision",
        "Scaling for greater impact",
        "Launched our 2025-2030 strategic plan focusing on climate action, biodiversity conservation, and sustainable development. Committed to planting 50,000 trees and reaching 100 communities by 2030.",
        "/uploads/history-2025.jpg",
        12,
      ],
    ];

    for (const [
      year,
      title,
      subtitle,
      content,
      image_url,
      order_position,
    ] of historyItems) {
      await pool.query(
        `INSERT INTO history (year, title, subtitle, content, image_url, order_position) VALUES (?, ?, ?, ?, ?, ?)`,
        [year, title, subtitle, content, image_url, order_position],
      );
    }
    logger.info("✅ History seeded");

    // Seed leadership section
    await pool.query(
      `INSERT INTO leadership_section (title, subtitle, image_url, is_active) 
       VALUES (?, ?, ?, ?)`,
      [
        "Our Leadership",
        "Meet the team driving environmental change",
        null,
        true,
      ],
    );
    logger.info("✅ Leadership section seeded");

    // Seed leadership
    const leadershipMembers = [
      [
        "Dr. Budi Santoso",
        "Founder & CEO",
        "Environmental scientist with 20+ years of experience in conservation and sustainability. Passionate about creating lasting environmental impact.",
        null,
        "budi.santoso@semestalestari.com",
        "+62 812 3456 7890",
        "https://linkedin.com/in/budisantoso",
        "https://instagram.com/budisantoso",
        true,
        1,
      ],
      [
        "Siti Nurhaliza",
        "Director of Programs",
        "Expert in community engagement and environmental education. Leading our programs across Indonesia.",
        null,
        "siti.nurhaliza@semestalestari.com",
        "+62 813 4567 8901",
        "https://linkedin.com/in/sitinurhaliza",
        "https://instagram.com/sitinurhaliza",
        false,
        2,
      ],
      [
        "Ahmad Wijaya",
        "Head of Operations",
        "Operations specialist ensuring efficient execution of our environmental initiatives.",
        null,
        "ahmad.wijaya@semestalestari.com",
        "+62 814 5678 9012",
        "https://linkedin.com/in/ahmadwijaya",
        "https://instagram.com/ahmadwijaya",
        false,
        3,
      ],
    ];

    for (const [
      name,
      position,
      bio,
      image_url,
      email,
      phone,
      linkedin_link,
      instagram_link,
      is_highlighted,
      order_position,
    ] of leadershipMembers) {
      await pool.query(
        `INSERT INTO leadership (name, position, bio, image_url, email, phone, linkedin_link, instagram_link, is_highlighted, order_position) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
        [
          name,
          position,
          bio,
          image_url,
          email,
          phone,
          linkedin_link,
          instagram_link,
          is_highlighted,
          order_position,
        ],
      );
    }
    logger.info("✅ Leadership seeded");

    // Seed categories
    // Seed categories (delegated to `seedArticleCategories`)
    await seedArticleCategories();

    // Seed articles
    const articles = [
      [
        "Tree Planting Initiative Reaches 10,000 Milestone",
        "Celebrating a decade of environmental impact",
        "tree-planting-initiative-reaches-10000-milestone",
        `# Tree Planting Initiative Reaches 10,000 Milestone

We are thrilled to announce that our tree planting initiative has successfully planted its **10,000th tree**! This milestone represents a decade of dedication, community involvement, and environmental stewardship.

## The Journey

Since 2014, our volunteers have worked tirelessly across Java and Bali, transforming barren lands into thriving green spaces. Each tree planted represents hope for a sustainable future.

### Impact Highlights

- **10,000+ trees** planted across 25 communities
- **500+ volunteers** actively participating
- **50+ hectares** of land reforested
- **Thousands of tons** of CO2 absorbed annually

## Looking Forward

This milestone is just the beginning. We're committed to planting 50,000 more trees by 2030, expanding our reach to more communities across Indonesia.

> "Every tree planted is a promise to future generations." - Dr. Budi Santoso, Founder

Join us in this journey towards a greener Indonesia!`,
        "We celebrate planting our 10,000th tree, marking a decade of environmental impact across Java and Bali with 500+ dedicated volunteers.",
        "https://images.unsplash.com/photo-1542601906990-b4d3fb778b09?w=800",
        2,
        1,
        "2024-01-15 10:00:00",
      ],
      [
        "Community Workshop: Sustainable Living Practices",
        "Empowering communities with eco-friendly solutions",
        "community-workshop-sustainable-living-practices",
        `# Community Workshop: Sustainable Living Practices

Last weekend, we hosted an inspiring workshop on **sustainable living practices** in Jakarta, bringing together over 100 community members eager to make a difference.

## Workshop Highlights

### Waste Management
Participants learned practical techniques for:
- Composting organic waste
- Recycling and upcycling materials
- Reducing single-use plastics

### Energy Conservation
We covered:
- Solar energy basics
- Energy-efficient appliances
- Water conservation methods

### Sustainable Gardening
Hands-on sessions included:
- Urban gardening techniques
- Native plant selection
- Organic pest control

## Participant Feedback

*"This workshop opened my eyes to simple changes I can make at home. I'm already composting!"* - Participant testimonial

## Next Steps

Based on the overwhelming response, we're planning monthly workshops across different cities. Stay tuned for announcements!

### Upcoming Workshops
- **February**: Surabaya
- **March**: Bandung
- **April**: Yogyakarta`,
        "Over 100 community members joined our sustainable living workshop, learning practical techniques for waste management, energy conservation, and urban gardening.",
        "https://images.unsplash.com/photo-1559027615-cd4628902d4a?w=800",
        2,
        2,
        "2024-02-01 14:30:00",
      ],
      [
        "Partnership with Local Schools for Environmental Education",
        "Inspiring the next generation of environmental stewards",
        "partnership-with-local-schools-environmental-education",
        `# Partnership with Local Schools for Environmental Education

We're excited to announce our new partnership with **15 local schools** to integrate environmental education into their curriculum!

## Program Overview

### Curriculum Integration
- Weekly environmental science lessons
- Hands-on field trips to conservation sites
- Student-led sustainability projects

### School Gardens
Each participating school will establish:
- Organic vegetable gardens
- Composting systems
- Rainwater harvesting

## Student Engagement

Students are already showing incredible enthusiasm:

1. **Eco Clubs** formed in all 15 schools
2. **500+ students** enrolled in the program
3. **Monthly competitions** for best sustainability projects

### Success Stories

> "Our students are now teaching their parents about recycling!" - Principal, SD Harapan Bangsa

## Long-term Vision

This partnership aims to:
- Reach 10,000 students by 2025
- Create a network of youth environmental ambassadors
- Establish model green schools across Indonesia

## Get Involved

Schools interested in joining this program can contact us at education@semestalestari.com`,
        "Partnering with 15 local schools to inspire 500+ students through hands-on environmental education, school gardens, and sustainability projects.",
        "https://images.unsplash.com/photo-1427504494785-3a9ca7044f45?w=800",
        2,
        2,
        "2024-02-10 09:00:00",
      ],
      [
        "5 Simple Ways to Reduce Your Carbon Footprint",
        "Practical tips for everyday environmental action",
        "5-simple-ways-reduce-carbon-footprint",
        `# 5 Simple Ways to Reduce Your Carbon Footprint

Making a positive environmental impact doesn't have to be complicated. Here are five simple, actionable steps you can take today!

## 1. Choose Reusable Over Disposable

### Why It Matters
Single-use plastics contribute significantly to pollution and take hundreds of years to decompose.

### Action Steps
- Carry a reusable water bottle
- Use cloth shopping bags
- Invest in reusable food containers
- Say no to plastic straws

**Impact**: Save up to 500 plastic items per year per person!

## 2. Reduce Energy Consumption

### Simple Changes
- Switch to LED bulbs (75% less energy)
- Unplug devices when not in use
- Use natural light when possible
- Set AC to 24°C instead of 18°C

**Impact**: Reduce your electricity bill by 20-30%!

## 3. Choose Sustainable Transportation

### Options
- Walk or bike for short distances
- Use public transportation
- Carpool with colleagues
- Consider electric vehicles

**Impact**: One person switching to public transport can save 4,800 pounds of CO2 annually!

## 4. Eat More Plant-Based Meals

### Benefits
- Lower carbon footprint
- Reduced water usage
- Better for health
- Support local farmers

**Tip**: Start with "Meatless Mondays"!

## 5. Support Local and Sustainable Businesses

### How to Choose
- Look for eco-certifications
- Buy from local farmers markets
- Choose products with minimal packaging
- Support companies with green initiatives

## Your Impact Matters

Remember, every small action counts. If everyone made these simple changes, we could collectively make a massive difference!

**Start today. Start small. Make it a habit.**`,
        "Discover five practical and easy-to-implement strategies to reduce your environmental impact and contribute to a more sustainable future.",
        "https://images.unsplash.com/photo-1532996122724-e3c354a0b15b?w=800",
        2,
        3,
        "2024-02-20 11:00:00",
      ],
      [
        "Semesta Lestari Receives National Environmental Award",
        "Recognition for outstanding conservation efforts",
        "semesta-lestari-receives-national-environmental-award",
        `# Semesta Lestari Receives National Environmental Award

We are honored to announce that Semesta Lestari has been awarded the **2024 National Environmental Excellence Award** by the Ministry of Environment and Forestry!

## The Recognition

This prestigious award recognizes organizations that have demonstrated:
- Outstanding environmental conservation efforts
- Significant community impact
- Innovation in sustainability practices
- Long-term commitment to environmental protection

## Our Journey

### Key Achievements
- **10,000+ trees** planted across Indonesia
- **25 communities** directly impacted
- **500+ active volunteers**
- **15 schools** in our education program

### Innovation Highlights
Our award-winning initiatives include:
1. Community-based reforestation program
2. School environmental education curriculum
3. Sustainable livelihood projects
4. Waste management training programs

## Gratitude

This award belongs to:
- Our dedicated volunteers
- Supporting communities
- Partner organizations
- Generous donors

> "This recognition motivates us to expand our impact and reach even more communities across Indonesia." - Dr. Budi Santoso

## What's Next

With this recognition, we're launching:
- **Expansion to 10 new regions**
- **Target: 50,000 trees by 2030**
- **New youth ambassador program**
- **Enhanced monitoring and evaluation systems**

## Join Our Mission

This is just the beginning. Together, we can create lasting environmental change across Indonesia.

**Thank you for being part of this journey!**`,
        "Semesta Lestari honored with the 2024 National Environmental Excellence Award for outstanding conservation efforts and community impact.",
        "https://images.unsplash.com/photo-1529070538774-1843cb3265df?w=800",
        2,
        4,
        "2024-03-01 08:00:00",
      ],
    ];

    for (const [
      title,
      subtitle,
      slug,
      content,
      excerpt,
      image_url,
      author_id,
      category_id,
      published_at,
    ] of articles) {
      await pool.query(
        `INSERT INTO articles (title, subtitle, slug, content, excerpt, image_url, author_id, category_id, published_at) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?) 
         ON DUPLICATE KEY UPDATE title=VALUES(title)`,
        [
          title,
          subtitle,
          slug,
          content,
          excerpt,
          image_url,
          author_id,
          category_id,
          published_at,
        ],
      );
    }
    logger.info("✅ Articles seeded");

    // Seed awards
    const awards = [
      [
        "Green Innovation Award 2024",
        "Recognized for outstanding innovation in sustainable waste management and community engagement programs",
        "https://images.unsplash.com/photo-1567427017947-545c5f8d16ad?w=800",
        2024,
        "Ministry of Environment and Forestry",
        1,
      ],
      [
        "Community Impact Award 2023",
        "Honored for significant contributions to environmental education and community empowerment initiatives",
        "https://images.unsplash.com/photo-1531482615713-2afd69097998?w=800",
        2023,
        "Indonesian Environmental Council",
        2,
      ],
      [
        "Sustainability Excellence Award 2022",
        "Awarded for excellence in promoting sustainable practices and environmental conservation efforts",
        "https://images.unsplash.com/photo-1552664730-d307ca884978?w=800",
        2022,
        "Asia Pacific Sustainability Network",
        3,
      ],
      [
        "Best NGO Initiative 2021",
        "Recognized as the best environmental NGO initiative for innovative community-based conservation programs",
        "https://images.unsplash.com/photo-1559027615-cd4628902d4a?w=800",
        2021,
        "National NGO Forum",
        4,
      ],
      [
        "Environmental Leadership Award 2020",
        "Acknowledged for exceptional leadership in driving environmental awareness and sustainable development",
        "https://images.unsplash.com/photo-1542744173-8e7e53415bb0?w=800",
        2020,
        "Global Green Foundation",
        5,
      ],
    ];

    for (const award of awards) {
      await pool.query(
        `INSERT INTO awards (title, short_description, image_url, year, issuer, order_position) VALUES (?, ?, ?, ?, ?, ?)`,
        award,
      );
    }
    logger.info("✅ Awards seeded");

    // Seed merchandise
    const merchandise = [
      [
        "Eco-Friendly Tote Bag",
        "https://images.unsplash.com/photo-1590874103328-eac38a683ce7?w=800",
        75000,
        "Tokopedia",
        "https://tokopedia.com/semestalestari/eco-tote-bag",
        1,
      ],
      [
        "Reusable Water Bottle",
        "https://images.unsplash.com/photo-1602143407151-7111542de6e8?w=800",
        125000,
        "Shopee",
        "https://shopee.co.id/semestalestari/reusable-bottle",
        2,
      ],
      [
        "Organic Cotton T-Shirt",
        "https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=800",
        150000,
        "Tokopedia",
        "https://tokopedia.com/semestalestari/organic-tshirt",
        3,
      ],
      [
        "Bamboo Cutlery Set",
        "https://images.unsplash.com/photo-1606854428728-5fe3eea23475?w=800",
        95000,
        "Shopee",
        "https://shopee.co.id/semestalestari/bamboo-cutlery",
        4,
      ],
      [
        "Recycled Notebook",
        "https://images.unsplash.com/photo-1531346878377-a5be20888e57?w=800",
        45000,
        "Bukalapak",
        "https://bukalapak.com/semestalestari/recycled-notebook",
        5,
      ],
      [
        "Stainless Steel Straw Set",
        "https://images.unsplash.com/photo-1625772452859-1c03d5bf1137?w=800",
        35000,
        "Tokopedia",
        "https://tokopedia.com/semestalestari/steel-straw-set",
        6,
      ],
    ];

    for (const item of merchandise) {
      await pool.query(
        `INSERT INTO merchandise (product_name, image_url, price, marketplace, marketplace_link, order_position) VALUES (?, ?, ?, ?, ?, ?)`,
        item,
      );
    }
    logger.info("✅ Merchandise seeded");

    // Seed gallery categories
    const galleryCategories = [
      [
        "Events",
        "events",
        "Photos from our environmental events and activities",
      ],
      ["Projects", "projects", "Documentation of our conservation projects"],
      [
        "Community",
        "community",
        "Community engagement and volunteer activities",
      ],
      ["Nature", "nature", "Beautiful nature and wildlife photography"],
    ];

    for (const category of galleryCategories) {
      await pool.query(
        `INSERT INTO gallery_categories (name, slug, description) VALUES (?, ?, ?) 
         ON DUPLICATE KEY UPDATE description=VALUES(description)`,
        category,
      );
    }
    logger.info("✅ Gallery categories seeded");

    // Seed gallery items
    const galleryItems = [
      [
        "Beach Cleanup Event 2024",
        "https://images.unsplash.com/photo-1618477461853-cf6ed80faba5?w=800",
        1,
        "2024-03-15",
        1,
      ],
      [
        "Tree Planting Campaign",
        "https://images.unsplash.com/photo-1542601906990-b4d3fb778b09?w=800",
        2,
        "2024-02-20",
        2,
      ],
      [
        "Community Workshop",
        "https://images.unsplash.com/photo-1559027615-cd4628902d4a?w=800",
        3,
        "2024-01-10",
        3,
      ],
      [
        "Mangrove Conservation",
        "https://images.unsplash.com/photo-1559827260-dc66d52bef19?w=800",
        2,
        "2023-12-05",
        4,
      ],
      [
        "Wildlife Photography",
        "https://images.unsplash.com/photo-1564760055775-d63b17a55c44?w=800",
        4,
        "2023-11-18",
        5,
      ],
      [
        "Environmental Education",
        "https://images.unsplash.com/photo-1503676260728-1c00da094a0b?w=800",
        3,
        "2023-10-22",
        6,
      ],
      [
        "Coral Reef Restoration",
        "https://images.unsplash.com/photo-1559827260-dc66d52bef19?w=800",
        2,
        "2023-09-30",
        7,
      ],
      [
        "Youth Volunteer Day",
        "https://images.unsplash.com/photo-1469571486292-0ba58a3f068b?w=800",
        1,
        "2023-08-14",
        8,
      ],
    ];

    for (const item of galleryItems) {
      await pool.query(
        `INSERT INTO gallery_items (title, image_url, category_id, gallery_date, order_position) VALUES (?, ?, ?, ?, ?)`,
        item,
      );
    }
    logger.info("✅ Gallery items seeded");

    // Seed donation CTA
    await pool.query(
      `INSERT INTO donation_ctas (title, description, button_text, button_url, is_active) 
       VALUES (?, ?, ?, ?, ?)`,
      [
        "Support Our Mission",
        "Your donation helps us create lasting environmental impact",
        "Donate Now",
        "/donate",
        true,
      ],
    );
    logger.info("✅ Donation CTA seeded");

    // Seed closing CTA
    await pool.query(
      `INSERT INTO closing_ctas (title, description, button_text, button_url, is_active) 
       VALUES (?, ?, ?, ?, ?)`,
      [
        "Join Our Community",
        "Be part of the change you want to see in the world",
        "Get Involved",
        "/contact",
        true,
      ],
    );
    logger.info("✅ Closing CTA seeded");

    // Seed settings
    const settings = [
      ["site_name", "Semesta Lestari"],
      ["site_description", "Environmental conservation organization"],
      ["contact_email", "info@semestalestari.org"],
      ["contact_phones", '["(+62) 21-1234-5678", "(+62) 812-3456-7890"]'],
      [
        "contact_address",
        "Jl. Lingkungan Hijau No. 123, Jakarta Selatan, DKI Jakarta 12345, Indonesia",
      ],
      [
        "contact_work_hours",
        "Monday - Friday: 09:00 AM - 05:00 PM\\nSaturday: 09:00 AM - 01:00 PM\\nSunday: Closed",
      ],
      ["contact_gmaps", "https://maps.google.com/?q=-6.200000,106.816666"],
      ["social_facebook", "https://facebook.com/semestalestari"],
      ["social_instagram", "https://instagram.com/semestalestari"],
      ["social_twitter", "https://twitter.com/semestalestari"],
      ["social_youtube", "https://youtube.com/@semestalestari"],
      ["social_linkedin", "https://linkedin.com/company/semestalestari"],
      ["social_tiktok", "https://tiktok.com/@semestalestari"],
    ];

    for (const [key, value] of settings) {
      await pool.query(
        `INSERT INTO settings (\`key\`, value) VALUES (?, ?) ON DUPLICATE KEY UPDATE value=value`,
        [key, value],
      );
    }
    logger.info("✅ Settings seeded");

    // Seed page settings (hero sections for different pages)
    const pageSettings = [
      {
        page_slug: "articles",
        title: "Artikel & Berita",
        sub_title: "Informasi Terkini",
        description:
          "Baca artikel terbaru kami tentang konservasi lingkungan dan keberlanjutan",
        image_url:
          "https://images.unsplash.com/photo-1504711434969-e33886168f5c?w=1200",
        meta_title: "Artikel & Berita - Semesta Lestari",
        meta_description:
          "Baca artikel terbaru tentang konservasi lingkungan dan keberlanjutan",
      },
      {
        page_slug: "awards",
        title: "Penghargaan",
        sub_title: "Apresiasi Atas Dedikasi Kami",
        description:
          "Temukan penghargaan dan pengakuan yang kami terima untuk kerja lingkungan kami",
        image_url:
          "https://images.unsplash.com/photo-1567427017947-545c5f8d16ad?w=1200",
        meta_title: "Penghargaan - Semesta Lestari",
        meta_description:
          "Penghargaan dan pengakuan untuk upaya konservasi lingkungan",
      },
      {
        page_slug: "merchandise",
        title: "Merchandise Ramah Lingkungan",
        sub_title: "Dukung Misi Kami",
        description:
          "Belanja koleksi produk berkelanjutan dan ramah lingkungan kami",
        image_url:
          "https://images.unsplash.com/photo-1441986300917-64674bd600d8?w=1200",
        meta_title: "Merchandise Ramah Lingkungan - Semesta Lestari",
        meta_description:
          "Belanja produk berkelanjutan yang mendukung misi kami",
      },
      {
        page_slug: "gallery",
        title: "Galeri Foto",
        sub_title: "Perjalanan Kami dalam Gambar",
        description:
          "Jelajahi koleksi foto dari berbagai program dan kegiatan lingkungan kami",
        image_url:
          "https://images.unsplash.com/photo-1492144534655-ae79c964c9d7?w=1200",
        meta_title: "Galeri Foto - Semesta Lestari",
        meta_description:
          "Foto dari program lingkungan dan kegiatan konservasi kami",
      },
      {
        page_slug: "leadership",
        title: "Kepengurusan",
        sub_title: "Tim Kami",
        description:
          "Kenali tim kepemimpinan yang mendedikasikan diri untuk konservasi lingkungan",
        image_url:
          "https://images.unsplash.com/photo-1522071820081-009f0129c71c?w=1200",
        meta_title: "Kepengurusan - Semesta Lestari",
        meta_description: "Tim kepemimpinan Semesta Lestari",
      },
      {
        page_slug: "contact",
        title: "Hubungi Kami",
        sub_title: "Mari Terhubung",
        description:
          "Hubungi kami untuk pertanyaan, kemitraan, atau informasi lebih lanjut",
        image_url:
          "https://images.unsplash.com/photo-1423666639041-f56000c27a9a?w=1200",
        meta_title: "Hubungi Kami - Semesta Lestari",
        meta_description: "Hubungi kami untuk pertanyaan dan kemitraan",
      },
      {
        page_slug: "history",
        title: "Sejarah",
        sub_title: "Perjalanan Kami",
        description:
          "Pelajari sejarah dan perjalanan Semesta Lestari dalam konservasi lingkungan",
        image_url:
          "https://images.unsplash.com/photo-1497436072909-60f360e1d4b1?w=1200",
        meta_title: "Sejarah - Semesta Lestari",
        meta_description: "Sejarah dan perjalanan Semesta Lestari",
      },
      {
        page_slug: "vision-mission",
        title: "Visi & Misi",
        sub_title: "Tujuan Kami",
        description:
          "Ketahui visi dan misi kami untuk masa depan lingkungan yang berkelanjutan",
        image_url:
          "https://images.unsplash.com/photo-1473496169904-658ba7c44d8a?w=1200",
        meta_title: "Visi & Misi - Semesta Lestari",
        meta_description:
          "Visi dan misi Semesta Lestari untuk lingkungan berkelanjutan",
      },
    ];

    for (const page of pageSettings) {
      await pool.query(
        `INSERT INTO page_settings (page_slug, title, sub_title, description, image_url, meta_title, meta_description) 
         VALUES (?, ?, ?, ?, ?, ?, ?) 
         ON DUPLICATE KEY UPDATE title=VALUES(title), sub_title=VALUES(sub_title), description=VALUES(description), image_url=VALUES(image_url)`,
        [
          page.page_slug,
          page.title,
          page.sub_title,
          page.description,
          page.image_url,
          page.meta_title,
          page.meta_description,
        ],
      );
    }
    logger.info("✅ Page settings seeded");

    logger.info("🎉 Database seeding completed successfully!");
    logger.info("📧 Admin login: admin@semestalestari.com");
    logger.info("🔑 Admin password: admin123");
  } catch (error) {
    logger.error("Error seeding database:", error);
    throw error;
  } finally {
    // Only close the pool when the script is executed directly (standalone).
    // When called from the server process we must keep the pool open.
    if (require.main === module) {
      await pool.end();
    }
  }
};

module.exports = { seedData, seedArticleCategories };
