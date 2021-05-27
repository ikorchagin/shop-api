import { isValidObjectId } from 'mongoose';

import Product from '../models/product';
import Comment from '../models/comment';
import shopService from '../services/shop-service';
import Rubric from '../models/rubric';
import HttpException from '../utils/http-exception';
import Spec from '../models/spec';

const shopController = {
  addProduct: async (req, res, next) => {
    const { rubric, ...body } = req.body;
    const product = new Product({
      ...body,
      rubric: isValidObjectId(rubric) ? rubric : null,
    });
    try {
      await product.save();
      return res.send({ data: product, errors: null });
    } catch (error) {
      return next(error);
    }
  },
  addComment: async (req, res, next) => {
    const comment = new Comment({ ...req.body, user: req.user._id });
    try {
      await comment.save();
      return res.send({ data: comment, errors: null });
    } catch (error) {
      return next(error);
    }
  },
  addRubric: async (req, res, next) => {
    try {
      const rubric = await shopService.addRubric({
        ...req.body,
        image: req.files?.image,
      });
      return res.send({ data: rubric, errors: null });
    } catch (error) {
      return next(error);
    }
  },
  getProducts: async (req, res, next) => {
    try {
      if (req.params.id) {
        const product = await Product.findById(req.params.id);
        return res.send({ data: product, errors: null });
      }
      console.log(req.query.rubricId);
      const products = await Product.find(
        req.query.rubricId ? { rubric: req.query.rubricId } : {},
        'name price shortDescription images'
      );
      return res.send({ data: products, errors: null });
    } catch (error) {
      return next(error);
    }
  },
  getRubrics: async (_req, res, next) => {
    try {
      const rubrics = await Rubric.find({});
      return res.send({ data: rubrics, errors: null });
    } catch (error) {
      return next(error);
    }
  },
  addSpecs: async (req, res, next) => {
    let product;
    const { specs } = req.body;
    try {
      product = await Product.findById(req.body.product);
    } catch {
      return next(
        new HttpException({ product: 'Продукт по данному id не найден' })
      );
    }

    await Promise.all(
      specs.map(async (el) => {
        const spec = new Spec(el);
        await spec.save();
        product.specs.push(spec._id);
      })
    );
    await product.save();
    const response = (
      await Product.findById(req.body.product).populate({
        path: 'specs',
        model: 'Spec',
        select: 'key value -_id',
      })
    ).specs;
    return res.send({
      data: response,
      errors: null,
    });
  },
  getSpecs: async (req, res, next) => {
    const product = await Product.findById(req.params.product).populate({
      path: 'specs',
      model: 'Spec',
      select: 'key value -_id',
    });
    if (!product) {
      return next(
        new HttpException({ product: 'Продукт по данному id не найден' })
      );
    }
    return res.send({ data: product.specs, errors: null });
  },
};

export default shopController;
