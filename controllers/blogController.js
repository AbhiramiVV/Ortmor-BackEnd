import moment from "moment/moment.js";
import { sendBlogNotification } from "../Helpers/newBlogAddedMail.js";
import Blog from "../model/blogModel.js";
import cloudinary from "../config/digitalocean.js";
import slugify from "slugify";
import { PutObjectCommand } from "@aws-sdk/client-s3";
import s3Client from "../config/digitalocean.js";

//add blogs

// export async function addBlog(req, res) {
//   try {
//     const {
//       title,
//       shortDescription,
//       metaTitle,
//       metaDescription,
//       metaTag,
//       date,
//       content,
//     } = req.body;
//     if (
//       !title ||
//       !shortDescription ||
//       !metaTitle ||
//       !metaDescription ||
//       !metaTag ||
//       !date ||
//       !content
//     ) {
//       res
//         .status(400)
//         .json({ status: false, message: "All fields are mandatory" });
//       return;
//     }

//     // Generate slug from title
//     const slug = slugify(title, { lower: true });

//     // Check if a blog with the same slug already exists
//     const existingBlog = await Blog.findOne({ slug });
//     if (existingBlog) {
//       res.status(400).json({ status: false, message: "Blog already exists" });
//       return;
//     }
//     // Upload each blog image content to Cloudinary

//     const uploadBlogToCloudinary = async (file) => {
//       if (file) {
//         const uploadedBlogContent = await cloudinary.uploader.upload(file, {
//           folder: "ortmor", 
//           resource_type: "image",
//         });
//         return uploadedBlogContent.url || "";
//       }
//       return "";
//     };
//     const uploadedImageUrl = await uploadBlogToCloudinary(
//       req.files.image[0].path
//     );

//     // Upload video to Cloudinary
//     const uploadBlogvideoToCloudinary = async (file) => {
//       if (file) {
//         const uploadedBlogContent = await cloudinary.uploader.upload(file, {
//           folder: "ortmor", 
//           resource_type: "video",
//         });
//         return uploadedBlogContent.url || "";
//       }
//       return "";
//     };
//     const uploadedVideoUrl = await uploadBlogvideoToCloudinary(
//       req.files.video[0].path
//     );

//     const formattedDate = moment(date, "DD-MM-YYYY").toDate();
//     const blog = new Blog({
//       title,
//       shortDescription,
//       metaTitle,
//       metaDescription,
//       metaTag,
//       slug,
//       date: formattedDate,
//       image: uploadedImageUrl, 
//       video: uploadedVideoUrl,
//       content,
//     });

//     await blog.save();

//     // Creating a message object for sending email messages
//     const message = {
//       blogName: `${title} - ${shortDescription}`,
//       blog: title,
//     };

//     res.status(200).json({ status: true, message: "Blog has been added successfully" });

//     // Sending an email notification about the blog added
//     await sendBlogNotification(process.env.ADMIN_EMAIL, message);
//   } catch (error) {
//     console.error(error);
//     res.status(500).json({ status: false, message: "Internal Server Error" });
//   }
// }

export async function addBlog(req, res) {
  try {
    const {
      title,
      shortDescription,
      metaTitle,
      metaDescription,
      metaTag,
      date,
      content,
    } = req.body;
    if (
      !title ||
      !shortDescription ||
      !metaTitle ||
      !metaDescription ||
      !metaTag ||
      !date ||
      !content
    ) {
      res
        .status(400)
        .json({ status: false, message: "All fields are mandatory" });
      return;
    }

    // Generate slug from title
    const slug = slugify(title, { lower: true });

    // Check if a blog with the same slug already exists
    const existingBlog = await Blog.findOne({ slug });
    if (existingBlog) {
      res.status(400).json({ status: false, message: "Blog already exists" });
      return;
    }
    if (!req.files) {
      return res.status(400).json({ error: 'No file uploaded' });
    }
  
   // Upload each blog image content to AWS S3
   const uploadObjectToS3 = async (file, resourceType) => {
    if (file) {
     const fileFormat = file.split('.').pop(); // Extract the file extension

      const params = {
        Bucket: "ortmorblog", 
        Key: `ortmor/${slug}-${resourceType}.${fileFormat}`, 
        Body: file,
        ACL: "public-read", // Optional: set ACL permissions
        ContentType: file.mimetype, // Set content type for proper display
      };

      try {
        const data = await s3Client.send(new PutObjectCommand(params));
        console.log("Successfully uploaded object to S3:", params.Key);
        
        // Construct and return the complete URL of the uploaded object
        const objectUrl = `https://blr1.digitaloceanspaces.com/${params.Key}`;
        return objectUrl; 
      } catch (error) {
        console.error("Error uploading object to S3:", error);
        return "";
      }
    }
    return "";
  };

  // Upload blog image to AWS S3
  const uploadedImageUrl = await uploadObjectToS3(
    req.files.image[0].path,
    "image"
  );

  // Upload video to AWS S3
  const uploadedVideoUrl = await uploadObjectToS3(
    req.files.video[0].path,
    "video"
  );
    const formattedDate = moment(date, "DD-MM-YYYY").toDate();
    const blog = new Blog({
      title,
      shortDescription,
      metaTitle,
      metaDescription,
      metaTag,
      slug,
      date: formattedDate,
      image: uploadedImageUrl, 
      video: uploadedVideoUrl,
      content,
    });

    await blog.save();

    // Creating a message object for sending email messages
    const message = {
      blogName: `${title} - ${shortDescription}`,
      blog: title,
    };

    res.status(200).json({ status: true, message: "Blog has been added successfully" });

    // Sending an email notification about the blog added
    await sendBlogNotification(process.env.ADMIN_EMAIL, message);
  } catch (error) {
    console.error(error);
    res.status(500).json({ status: false, message: "Internal Server Error" });
  }
}
//get blogs

export async function getBlog(req, res) {
  try {
    // finding All blog and find the title details also by populating
    const blog = await Blog.find().skip(req.paginatedResults.startIndex).limit(req.paginatedResults.limit).populate("title").lean();
    if (blog) {
      res.status(200).json({ status: true, blog, pagination: req.paginatedResults });
    }
  } catch (error) {
    console.log(error);
    res.status(500).json({ status: false, message: " Internal Server Error " });
  }
}

// Delete blog

export async function deleteBlog(req, res) {
  try {
  

    const deletedBlog = await Blog.findByIdAndDelete(req.params.blogId);

    if (deletedBlog) {
      res.status(200).json({ status: true, message: " Blog deleted successfully" });
    } else {
      res.status(500).json({ status: false, message: "Internal Server Error" });
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ status: false, message: "Internal server error" });
  }
}

// Edit blog Details

export async function EditBlogDetails(req, res) {
  try {
    const blog = await Blog.findOne({ _id: req.body.blogId });
    if (!blog) {
      return res.status(404).json({ status: false, message: "Blog not found" });
    }

    const slug = req.body.slug.toLowerCase().replace(/ /g, "-");

      // Upload each blog image content to AWS S3
      const uploadObjectToS3 = async (file, resourceType) => {
        if (file) {
          const fileFormat = file.split('.').pop(); // Extract the file extension
          const params = {
            Bucket: "ortmorblog", // Your S3 bucket name
            Key: `ortmor/${slug}-${resourceType}.${fileFormat}`,// Object key in S3 bucket
            Body: file,
            ACL: "public-read", // Optional: set ACL permissions
            ContentType: file.mimetype, // Set content type for proper display
          };
    
          try {
            const data = await s3Client.send(new PutObjectCommand(params));
            console.log("Successfully uploaded object to S3:", params.Key);
            const objectUrl = `https://ortmorblog.blr1.digitaloceanspaces.com/${params.Key}`;
             return `${objectUrl}`;
          } catch (error) {
            console.error("Error uploading object to S3:", error);
            return "";
          }
        }
        return "";
      };
    
      // Upload blog image to AWS S3
      const uploadedImageUrl = await uploadObjectToS3(
        req.files.image[0].path,
        "image"
      );
    
      // Upload video to AWS S3
      const uploadedVideoUrl = await uploadObjectToS3(
        req.files.video[0].path,
        "video"
      );

    const formattedDate = moment(req.body.date, "DD-MM-YYYY").toDate();
    // Slug creation

    await Blog.updateOne(
      { _id: req.body.blogId },
      {
        $set: {
          title: req.body.title,
          shortDescription: req.body.shortDescription,
          metaTitle: req.body.metaTitle,
          metaDescription: req.body.metaDescription,
          metaTag: req.body.metaTag,
          slug: slug,
          date: formattedDate,
          content: req.body.content,
          image:uploadedImageUrl,
          video:uploadedVideoUrl,
        },
      }
    );

    res.status(200).json({ status: true, message: "Blog updated successfully" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ status: false, message: "Internal server error" });
  }
}
