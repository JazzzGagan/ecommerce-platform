import logo from "../../assets/logo/logo2.svg";

export default function Footer() {
  return (
    <footer className="mt-12 border-t border-muted/30 bg-bg">
      <div className="container py-8 grid gap-8 md:grid-cols-3">
        <div>
          <div className="w-30 h-30 ">
            <img src={logo} alt="logo" className="w-full h-full" />
          </div>
          <p className="mt-3 text-sm text-muted font-body">
            Manage products and categories with a clean, consistent UI.
          </p>
        </div>
        <div>
          <h4 className="font-heading text-sm text-secondary-dark mb-3">
            Resources
          </h4>
          <ul className="space-y-2 text-sm text-muted">
            <li>
              <a href="#" className="hover:text-secondary-dark">
                Docs
              </a>
            </li>
            <li>
              <a href="#" className="hover:text-secondary-dark">
                Support
              </a>
            </li>
            <li>
              <a href="#" className="hover:text-secondary-dark">
                Status
              </a>
            </li>
          </ul>
        </div>
        <div>
          <h4 className="font-heading text-sm text-secondary-dark mb-3">
            Stay updated
          </h4>
          <form className="flex gap-2">
            <input
              type="email"
              placeholder="you@example.com"
              className="flex-1 px-3 py-2 rounded-md border border-muted/30 bg-white text-sm font-body focus:outline-none focus:ring-2 focus:ring-secondary-light"
            />
            <button className="px-4 py-2 rounded-md bg-secondary-light text-white hover:bg-secondary-dark text-sm">
              Subscribe
            </button>
          </form>
        </div>
      </div>
      <div className="border-t border-muted/30">
        <div className="container py-4 flex items-center justify-between text-xs text-muted">
          <span>© {new Date().getFullYear()} Ecommerce Admin</span>
          <span>Built with Tailwind</span>
        </div>
      </div>
    </footer>
  );
}
