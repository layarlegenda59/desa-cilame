const Joi = require('joi');
const { AppError } = require('./errorHandler');
const { logger } = require('../config/database');

// Custom Joi extensions
const customJoi = Joi.extend({
  type: 'string',
  base: Joi.string(),
  messages: {
    'string.indonesianPhone': 'Nomor telepon harus dalam format Indonesia yang valid'
  },
  rules: {
    indonesianPhone: {
      validate(value, helpers) {
        // Indonesian phone number validation
        const phoneRegex = /^(\+62|62|0)[0-9]{9,13}$/;
        if (!phoneRegex.test(value)) {
          return helpers.error('string.indonesianPhone');
        }
        return value;
      }
    }
  }
});

// Common validation schemas
const commonSchemas = {
  id: Joi.number().integer().positive().required(),
  slug: Joi.string().pattern(/^[a-z0-9-]+$/).min(3).max(100),
  email: Joi.string().email().lowercase().trim(),
  password: Joi.string().min(8).pattern(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]/).message('Password harus mengandung minimal 8 karakter, 1 huruf besar, 1 huruf kecil, 1 angka, dan 1 karakter khusus'),
  phone: customJoi.string().indonesianPhone(),
  url: Joi.string().uri(),
  date: Joi.date().iso(),
  status: Joi.string().valid('active', 'inactive', 'pending', 'draft', 'published'),
  role: Joi.string().valid('admin', 'editor', 'user'),
  pagination: {
    page: Joi.number().integer().min(1).default(1),
    limit: Joi.number().integer().min(1).max(100).default(10),
    sort: Joi.string().pattern(/^[a-zA-Z_]+:(asc|desc)$/),
    search: Joi.string().trim().max(100)
  }
};

// User validation schemas
const userSchemas = {
  register: Joi.object({
    username: Joi.string().alphanum().min(3).max(30).required(),
    email: commonSchemas.email.required(),
    password: commonSchemas.password.required(),
    full_name: Joi.string().min(2).max(100).required(),
    phone: commonSchemas.phone.optional(),
    role: commonSchemas.role.default('user')
  }),
  
  login: Joi.object({
    email: commonSchemas.email.required(),
    password: Joi.string().required()
  }),
  
  update: Joi.object({
    username: Joi.string().alphanum().min(3).max(30),
    email: commonSchemas.email,
    full_name: Joi.string().min(2).max(100),
    phone: commonSchemas.phone,
    bio: Joi.string().max(500),
    avatar: Joi.string().uri()
  }),
  
  changePassword: Joi.object({
    current_password: Joi.string().required(),
    new_password: commonSchemas.password.required(),
    confirm_password: Joi.string().valid(Joi.ref('new_password')).required().messages({
      'any.only': 'Konfirmasi password tidak cocok'
    })
  })
};

// News validation schemas
const newsSchemas = {
  create: Joi.object({
    title: Joi.string().min(5).max(200).required(),
    slug: commonSchemas.slug.optional(),
    content: Joi.string().min(50).required(),
    excerpt: Joi.string().max(300).optional(),
    featured_image: Joi.string().uri().optional(),
    category_id: commonSchemas.id.required(),
    tags: Joi.array().items(Joi.string().trim().max(50)).max(10).optional(),
    status: Joi.string().valid('draft', 'published').default('draft'),
    published_at: commonSchemas.date.optional(),
    meta_title: Joi.string().max(60).optional(),
    meta_description: Joi.string().max(160).optional()
  }),
  
  update: Joi.object({
    title: Joi.string().min(5).max(200),
    slug: commonSchemas.slug,
    content: Joi.string().min(50),
    excerpt: Joi.string().max(300),
    featured_image: Joi.string().uri(),
    category_id: commonSchemas.id,
    tags: Joi.array().items(Joi.string().trim().max(50)).max(10),
    status: Joi.string().valid('draft', 'published'),
    published_at: commonSchemas.date,
    meta_title: Joi.string().max(60),
    meta_description: Joi.string().max(160)
  }),
  
  query: Joi.object({
    ...commonSchemas.pagination,
    category: Joi.string().trim(),
    status: Joi.string().valid('draft', 'published'),
    author: Joi.string().trim(),
    tag: Joi.string().trim(),
    date_from: commonSchemas.date,
    date_to: commonSchemas.date
  })
};

// UMKM validation schemas
const umkmSchemas = {
  create: Joi.object({
    name: Joi.string().min(2).max(100).required(),
    description: Joi.string().min(10).max(1000).required(),
    owner_name: Joi.string().min(2).max(100).required(),
    phone: commonSchemas.phone.required(),
    email: commonSchemas.email.optional(),
    address: Joi.string().min(10).max(300).required(),
    category_id: commonSchemas.id.required(),
    website: commonSchemas.url.optional(),
    social_media: Joi.object({
      facebook: Joi.string().uri().optional(),
      instagram: Joi.string().uri().optional(),
      whatsapp: commonSchemas.phone.optional()
    }).optional(),
    images: Joi.array().items(Joi.string().uri()).max(5).optional(),
    status: commonSchemas.status.default('pending')
  }),
  
  update: Joi.object({
    name: Joi.string().min(2).max(100),
    description: Joi.string().min(10).max(1000),
    owner_name: Joi.string().min(2).max(100),
    phone: commonSchemas.phone,
    email: commonSchemas.email,
    address: Joi.string().min(10).max(300),
    category_id: commonSchemas.id,
    website: commonSchemas.url,
    social_media: Joi.object({
      facebook: Joi.string().uri(),
      instagram: Joi.string().uri(),
      whatsapp: commonSchemas.phone
    }),
    images: Joi.array().items(Joi.string().uri()).max(5),
    status: commonSchemas.status
  })
};

// File upload validation
const fileSchemas = {
  image: Joi.object({
    mimetype: Joi.string().valid('image/jpeg', 'image/png', 'image/webp').required(),
    size: Joi.number().max(5 * 1024 * 1024).required() // 5MB
  }),
  
  document: Joi.object({
    mimetype: Joi.string().valid('application/pdf', 'application/msword', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document').required(),
    size: Joi.number().max(10 * 1024 * 1024).required() // 10MB
  })
};

// Validation middleware factory
const validate = (schema, property = 'body') => {
  return (req, res, next) => {
    const { error, value } = schema.validate(req[property], {
      abortEarly: false,
      allowUnknown: false,
      stripUnknown: true
    });
    
    if (error) {
      const errorMessage = error.details.map(detail => detail.message).join(', ');
      logger.warn(`Validation error: ${errorMessage}`, {
        path: req.path,
        method: req.method,
        body: req.body
      });
      
      return next(new AppError(`Validation Error: ${errorMessage}`, 400));
    }
    
    // Replace the original data with validated and sanitized data
    req[property] = value;
    next();
  };
};

// Multiple property validation
const validateMultiple = (schemas) => {
  return (req, res, next) => {
    const errors = [];
    
    Object.keys(schemas).forEach(property => {
      const { error, value } = schemas[property].validate(req[property], {
        abortEarly: false,
        allowUnknown: false,
        stripUnknown: true
      });
      
      if (error) {
        errors.push(...error.details.map(detail => `${property}: ${detail.message}`));
      } else {
        req[property] = value;
      }
    });
    
    if (errors.length > 0) {
      const errorMessage = errors.join(', ');
      logger.warn(`Validation error: ${errorMessage}`, {
        path: req.path,
        method: req.method
      });
      
      return next(new AppError(`Validation Error: ${errorMessage}`, 400));
    }
    
    next();
  };
};

// File validation middleware
const validateFile = (schema) => {
  return (req, res, next) => {
    if (!req.file && !req.files) {
      return next();
    }
    
    const files = req.files || [req.file];
    
    for (const file of files) {
      const { error } = schema.validate({
        mimetype: file.mimetype,
        size: file.size
      });
      
      if (error) {
        const errorMessage = error.details.map(detail => detail.message).join(', ');
        return next(new AppError(`File validation error: ${errorMessage}`, 400));
      }
    }
    
    next();
  };
};

// Sanitize HTML content
const sanitizeHtml = (allowedTags = ['p', 'br', 'strong', 'em', 'u', 'ol', 'ul', 'li', 'a', 'img']) => {
  return (req, res, next) => {
    // This would typically use a library like DOMPurify or sanitize-html
    // For now, we'll just strip script tags as a basic example
    const sanitizeString = (str) => {
      if (typeof str !== 'string') return str;
      return str.replace(/<script[^>]*>.*?<\/script>/gi, '');
    };
    
    const sanitizeObject = (obj) => {
      for (const key in obj) {
        if (typeof obj[key] === 'string') {
          obj[key] = sanitizeString(obj[key]);
        } else if (typeof obj[key] === 'object' && obj[key] !== null) {
          sanitizeObject(obj[key]);
        }
      }
    };
    
    sanitizeObject(req.body);
    next();
  };
};

module.exports = {
  validate,
  validateMultiple,
  validateFile,
  sanitizeHtml,
  userSchemas,
  newsSchemas,
  umkmSchemas,
  fileSchemas,
  commonSchemas
};