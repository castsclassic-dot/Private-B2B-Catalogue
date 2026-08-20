import { Router, type IRouter } from "express";
import {
  GetCatalogueSummaryResponse,
  ListProductsResponse,
} from "@workspace/api-zod";
import { requireUser, type AuthedRequest } from "../lib/supabase";

const router: IRouter = Router();

router.get("/catalogue/products", requireUser, async (req, res) => {
  const { data, error } = await (req as AuthedRequest).supabase!
    .from("products")
    .select("id, sku, name, category, material, description, image_path, is_published, vendors(name)")
    .eq("is_published", true)
    .order("created_at", { ascending: false });
  if (error) {
    res.status(500).json({ error: "Unable to load products" });
    return;
  }
  const products = await Promise.all(
    (data ?? []).map(async (product) => {
      const imagePath = product.image_path as string | null;
      let imageUrl: string | null = null;
      if (imagePath) {
        const signed = await (req as AuthedRequest).supabase!.storage
          .from("product-images")
          .createSignedUrl(imagePath, 3600);
        imageUrl = signed.data?.signedUrl ?? null;
      }
      const vendor = Array.isArray(product.vendors) ? product.vendors[0] : product.vendors;
      return {
        id: product.id,
        sku: product.sku,
        name: product.name,
        category: product.category,
        material: product.material,
        description: product.description,
        vendorName: vendor?.name ?? "Unassigned",
        imageUrl,
        isPublished: product.is_published,
      };
    }),
  );
  res.json(ListProductsResponse.parse(products));
});

router.get("/catalogue/summary", requireUser, async (req, res) => {
  const supabase = (req as AuthedRequest).supabase!;
  const [{ count: productCount, error: productsError }, { count: vendorCount, error: vendorsError }, { data: categoryRows, error: categoriesError }] = await Promise.all([
    supabase.from("products").select("id", { count: "exact", head: true }).eq("is_published", true),
    supabase.from("vendors").select("id", { count: "exact", head: true }),
    supabase.from("products").select("category").eq("is_published", true),
  ]);
  if (productsError || vendorsError || categoriesError) {
    res.status(500).json({ error: "Unable to load catalogue summary" });
    return;
  }
  const categories = [...new Set((categoryRows ?? []).map((row) => row.category))].sort();
  res.json(GetCatalogueSummaryResponse.parse({ productCount: productCount ?? 0, vendorCount: vendorCount ?? 0, categories }));
});

export default router;