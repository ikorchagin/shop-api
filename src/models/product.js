import { model, Schema } from 'mongoose';

const Product = model(
  'Product',
  new Schema({
    name: {
      type: String,
      required: true,
    },
    shortDescription: {
      type: String,
      required: true,
    },
    description: {
      type: String,
      required: true,
    },
    price: {
      type: Number,
      required: true,
    },
    images: [String],
    rubric: {
      type: Schema.Types.ObjectId,
      ref: 'Rubric',
      default: null,
    },
    comments: [
      {
        type: Schema.Types.ObjectId,
        ref: 'Comment',
      },
    ],
    specs: [{ type: Schema.Types.ObjectId, ref: 'Spec' }],
  })
);

export default Product;
