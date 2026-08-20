import { Router, type IRouter } from "express";
import { ListAdminProductsResponse, ListVendorsResponse } from "@workspace/api-zod";
import { requireAdmin, type AuthedRequest } from "../lib/supabase";

const router: IRouter = Router();

router.get("/admin/vendors", requireAdmin, async (req, res) => {
  const { data, error } = await (req as AuthedRequest).supabase!
    .from("vendors")
    .select("id, name, code, products(id)")
    .order("name");
  if (error) {
    res.status(500).json({ error: "Unable to load vendors" });
    return;
  }
  const vendors = (data ?? []).map((vendor) => ({
    id: vendor.id,
    name: vendor.name,
    code: vendor.code,
    productCount: Array.isArray(vendor.products) ? vendor.products.length : 0,
  }));
  res.json(ListVendorsResponse.parse(vendors));
});

router.get("/admin/products", requireAdmin, async (req, res) => {
  const { data, error } = await (req as AuthedRequest).supabase!
    .from("products")
    .select("id, sku, name, category, material, description, image_path, is_published, vendors(name)")
    .order("created_at", { ascending: false });
  if (error) {
    res.status(500).json({ error: "Unable to load products" });
    return;
  }
  const products = (data ?? []).map((product) => {
    const vendor = Array.isArray(product.vendors) ? product.vendors[0] : product.vendors;
    return {
      id: product.id,
      sku: product.sku,
      name: product.name,
      category: product.category,
      material: product.material,
      description: product.description,
      vendorName: vendor?.name ?? "Unassigned",
      imageUrl: null,
      isPublished: product.is_published,
    };
  });
  res.json(ListAdminProductsResponse.parse(products));
});

export default router;