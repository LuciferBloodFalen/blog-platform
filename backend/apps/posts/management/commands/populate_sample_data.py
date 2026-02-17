from django.core.management.base import BaseCommand
from django.utils.text import slugify

from apps.posts.models import Category, Tag


class Command(BaseCommand):
    help = "Populate the database with sample categories and tags"

    def add_arguments(self, parser):
        parser.add_argument(
            "--clear",
            action="store_true",
            help="Clear existing categories and tags before adding new ones",
        )

    def handle(self, *args, **options):
        if options["clear"]:
            self.stdout.write(
                self.style.WARNING("Clearing existing categories and tags...")
            )
            Category.objects.all().delete()
            Tag.objects.all().delete()

        # Sample categories
        categories_data = [
            "Technology",
            "Web Development",
            "Programming",
            "Machine Learning",
            "Data Science",
            "DevOps",
            "Mobile Development",
            "Design",
            "Business",
            "Tutorials",
            "Reviews",
            "News",
            "Opinion",
            "Personal",
            "Career",
        ]

        # Sample tags
        tags_data = [
            "Python",
            "JavaScript",
            "React",
            "Django",
            "Node.js",
            "TypeScript",
            "Vue.js",
            "Angular",
            "CSS",
            "HTML",
            "SQL",
            "PostgreSQL",
            "MySQL",
            "MongoDB",
            "Redis",
            "Docker",
            "Kubernetes",
            "AWS",
            "Azure",
            "GCP",
            "Linux",
            "Git",
            "CI/CD",
            "Testing",
            "API",
            "REST",
            "GraphQL",
            "Microservices",
            "Frontend",
            "Backend",
            "Fullstack",
            "Mobile",
            "iOS",
            "Android",
            "Flutter",
            "React Native",
            "UI/UX",
            "Figma",
            "Photoshop",
            "AI",
            "Machine Learning",
            "Deep Learning",
            "TensorFlow",
            "PyTorch",
            "Data Analysis",
            "Pandas",
            "NumPy",
            "Jupyter",
            "Scikit-learn",
            "Big Data",
            "Analytics",
            "Visualization",
            "Startup",
            "Entrepreneur",
            "Remote Work",
            "Productivity",
            "Leadership",
            "Management",
            "Open Source",
            "Security",
            "Performance",
            "Optimization",
            "Architecture",
            "Clean Code",
            "Best Practices",
            "Tips",
            "Tutorial",
            "Beginner",
            "Advanced",
            "Guide",
            "How-to",
            "Review",
            "Comparison",
            "Tools",
            "Resources",
            "Learning",
            "Career",
            "Interview",
            "Coding",
            "Debugging",
            "Problem Solving",
        ]

        # Create categories
        self.stdout.write("Creating categories...")
        categories_created = 0
        for category_name in categories_data:
            category, created = Category.objects.get_or_create(
                name=category_name, defaults={"slug": slugify(category_name)}
            )
            if created:
                categories_created += 1
                self.stdout.write(f"  ✓ Created category: {category_name}")
            else:
                self.stdout.write(f"  - Category already exists: {category_name}")

        # Create tags
        self.stdout.write("Creating tags...")
        tags_created = 0
        for tag_name in tags_data:
            tag, created = Tag.objects.get_or_create(
                name=tag_name, defaults={"slug": slugify(tag_name)}
            )
            if created:
                tags_created += 1
                self.stdout.write(f"  ✓ Created tag: {tag_name}")
            else:
                self.stdout.write(f"  - Tag already exists: {tag_name}")

        # Summary
        self.stdout.write("")
        self.stdout.write(
            self.style.SUCCESS(
                f"Successfully created {categories_created} categories and {tags_created} tags!"
            )
        )
        self.stdout.write(
            self.style.SUCCESS(
                f"Total: {Category.objects.count()} categories, {Tag.objects.count()} tags"
            )
        )
