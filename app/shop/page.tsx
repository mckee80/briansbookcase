import { mockProducts } from '@/data/mockData';

export default function Shop() {
  const merchandise = mockProducts.filter(p => p.category === 'Merchandise');
  const memberships = mockProducts.filter(p => p.category === 'Membership');

  return (
    <main className="min-h-screen p-8">
      <div className="max-w-7xl mx-auto">
        <h1 className="text-4xl font-bold font-garamond mb-6 text-primary">
          Shop
        </h1>
        <p className="font-crimson text-lg mb-8 text-gray-700">
          Purchase items to support our suicide prevention mission. Every purchase helps save lives.
        </p>

        {/* Memberships Section */}
        <section className="mb-12">
          <h2 className="text-3xl font-bold font-garamond mb-6 text-primary">
            Memberships
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {memberships.map((product) => (
              <div
                key={product.id}
                className="bg-white rounded-lg border-2 border-border shadow-md p-6 hover:shadow-xl hover:-translate-y-1 transition-all relative page-corner"
              >
                <h3 className="font-bold font-garamond text-2xl mb-3 text-primary">
                  {product.name}
                </h3>
                <p className="font-crimson text-gray-600 mb-4">
                  {product.description}
                </p>
                <div className="flex justify-between items-center">
                  <span className="text-3xl font-bold text-accent">
                    ${product.price.toFixed(2)}
                    <span className="text-sm font-normal text-gray-500">/year</span>
                  </span>
                  <button className="px-6 py-3 bg-accent text-white rounded-lg hover:bg-primary transition-colors font-semibold">
                    Subscribe
                  </button>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Merchandise Section */}
        <section>
          <h2 className="text-3xl font-bold font-garamond mb-6 text-primary">
            Merchandise
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {merchandise.map((product) => (
              <div
                key={product.id}
                className="bg-white rounded-lg border-2 border-border shadow-md overflow-hidden hover:shadow-xl hover:-translate-y-1 transition-all"
              >
                <div className="h-48 bg-gradient-to-br from-primary/10 to-accent/10 flex items-center justify-center">
                  <div className="text-6xl">📦</div>
                </div>
                <div className="p-4">
                  <h3 className="font-bold font-garamond text-lg mb-2 text-primary">
                    {product.name}
                  </h3>
                  <p className="font-crimson text-sm text-gray-600 mb-4">
                    {product.description}
                  </p>
                  <div className="flex justify-between items-center">
                    <span className="text-xl font-bold text-accent">
                      ${product.price.toFixed(2)}
                    </span>
                    <button className="px-4 py-2 bg-accent text-white rounded hover:bg-primary transition-colors text-sm">
                      Add to Cart
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </section>
      </div>
    </main>
  );
}
