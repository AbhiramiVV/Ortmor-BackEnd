import moment from "moment/moment.js";
import { sendBlogNotification } from "../Helpers/newBlogAddedMail.js";
import Blog from "../model/blogModel.js";
import cloudinary from "../config/cloudinary.js";

//add blogs

export async function addBlog(req, res) {
  try {
    const {
      title,
      shortDescription,
      metaTitle,
      metaDescription,
      metaTag,
      slug,
      date,
      content,
    } = req.body;
    if (
      !title ||
      !shortDescription ||
      !metaTitle ||
      !metaDescription ||
      !metaTag ||
      !slug ||
      !date ||
      !content
    ) {
      res
        .status(400)
        .json({ status: false, message: "All fields are mandatory" });
      return;
    }

    // Upload each blog image content to Cloudinary

    const uploadBlogToCloudinary = async (file) => {
      if (file) {
        const uploadedBlogContent = await cloudinary.uploader.upload(file, {
          folder: "ortmor", // Setting folder to upload
          resource_type: "image",
        });
        return uploadedBlogContent.url || "";
      }
      return "";
    };
    const uploadedImageUrl = await uploadBlogToCloudinary(
      req.files.image[0].path
    );

    // Upload video to Cloudinary
    const uploadBlogvideoToCloudinary = async (file) => {
      if (file) {
        const uploadedBlogContent = await cloudinary.uploader.upload(file, {
          folder: "ortmor", // Setting folder to upload
          resource_type: "video",
        });
        return uploadedBlogContent.url || "";
      }
      return "";
    };
    const uploadedVideoUrl = await uploadBlogvideoToCloudinary(
      req.files.video[0].path
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
      image: uploadedImageUrl, // Use uploaded image URL here
      video: uploadedVideoUrl,
      content,
    });

    await blog.save();

    // Creating a message object for sending email messages
    const message = {
      blogName: `${title} - ${shortDescription}`,
      blog: title,
    };

    res
      .status(200)
      .json({ status: true, message: "Blog has been added successfully" });

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
    const blog = await Blog.find()
      .skip(req.paginatedResults.startIndex)
      .limit(req.paginatedResults.limit)
      .populate("title")
      .lean();
    if (blog) {
      res
        .status(200)
        .json({ status: true, blog, pagination: req.paginatedResults });
    }
  } catch (error) {
    console.log(error);
    res.status(500).json({ status: false, message: " Internal Server Error " });
  }
}

// Delete blog

export async function deleteBlog(req, res) {
  try {
    // Find course by id and delete

    const deletedBlog = await Blog.findByIdAndDelete(req.params.blogId);

    if (deletedBlog) {
      res
        .status(200)
        .json({ status: true, message: " Blog deleted successfully" });
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
    //update images
    const uploadBlogToCloudinary = async (file) => {
      if (file) {
        const uploadedBlogContent = await cloudinary.uploader.upload(file, {
          folder: "ortmor",
          resource_type: "image",
        });
        return uploadedBlogContent.secure_url || "";
      }
      return "";
    };

    let image;
    if (req.files?.image && req.files.image[0].path) {
      const uploadedImageUrl = await uploadBlogToCloudinary(
        req.files.image[0].path
      );
      if (uploadedImageUrl) {
        image = uploadedImageUrl;
      }
    } else {
      image = blog.image;
    }
    //update videos
    const uploadBlogvideoToCloudinary = async (file) => {
      if (file) {
        const uploadedBlogContent = await cloudinary.uploader.upload(file, {
          folder: "ortmor",
          resource_type: "video",
        });
        return uploadedBlogContent.url || "";
      }
      return "";
    };
    let video;
    if (req.files?.video && req.files.video[0].path) {
      const uploadedVideoUrl = await uploadBlogvideoToCloudinary(
        req.files.video[0].path
      );

      if (uploadedVideoUrl) {
        video = uploadedVideoUrl;
      }
    } else {
      video = blog.video;
    }

    const formattedDate = moment(req.body.date, "DD-MM-YYYY").toDate();

    await Blog.updateOne(
      { _id: req.body.blogId },
      {
        $set: {
          title: req.body.title,
          shortDescription: req.body.shortDescription,
          metaTitle: req.body.metaTitle,
          metaDescription: req.body.metaDescription,
          metaTag: req.body.metaTag,
          slug: req.body.slug,
          date: formattedDate,
          content: req.body.content,
          image,
          video,
        },
      }
    );

    res
      .status(200)
      .json({ status: true, message: "Blog updated successfully" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ status: false, message: "Internal server error" });
  }
}
