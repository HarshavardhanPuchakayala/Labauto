import { Link } from "react-router-dom";
import {
  FiActivity,
  FiCheck,
  FiFileText,
  FiLayers,
  FiShield,
  FiUsers,
} from "react-icons/fi";

import Logo from "../components/ui/Logo";
import Button from "../components/ui/Button";
import Card from "../components/ui/Card";
import Badge from "../components/ui/Badge";

const features = [
  {
    icon: FiUsers,
    title: "Patient records",
    description: "Register patients, search by name or phone, and keep every visit on one profile.",
  },
  {
    icon: FiLayers,
    title: "Custom test templates",
    description: "Build your own test panels or load 20 standard Indian diagnostic templates instantly.",
  },
  {
    icon: FiFileText,
    title: "Full report lifecycle",
    description: "From sample collection to result entry to a branded, print-ready PDF report.",
  },
  {
    icon: FiShield,
    title: "Insurance tracking",
    description: "Keep policy numbers and expiry dates against each patient's profile.",
  },
  {
    icon: FiActivity,
    title: "Reference ranges built in",
    description: "Standard Indian lab reference ranges, with automatic abnormal-value flagging on reports.",
  },
  {
    icon: FiCheck,
    title: "Your own branding",
    description: "Upload your lab's logo — it appears as a letterhead and watermark on every report.",
  },
];

const plans = [
  {
    name: "Free Trial",
    duration: "14 Days",
    price: "₹0",
    description: "Try the full platform with no commitment.",
    highlight: false,
  },
  {
    name: "Quarterly",
    duration: "3 Months",
    price: "Contact us",
    description: "For labs getting started with digital reports.",
    highlight: false,
  },
  {
    name: "Half-Yearly",
    duration: "6 Months",
    price: "Contact us",
    description: "Our most popular plan for small independent labs.",
    highlight: true,
  },
  {
    name: "Annual",
    duration: "12 Months",
    price: "Contact us",
    description: "Best value for labs planning ahead for the year.",
    highlight: false,
  },
];

function Landing() {
  return (
    <div className="min-h-screen bg-slate-50">
      {/* Top nav */}
      <header className="border-b border-slate-200 bg-white">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-4 sm:px-6 lg:px-10">
          <Logo />
          <div className="flex items-center gap-3">
            <Link to="/login">
              <Button variant="ghost">Log in</Button>
            </Link>
            <Link to="/signup">
              <Button>Start free trial</Button>
            </Link>
          </div>
        </div>
      </header>

      {/* Hero */}
      <section className="mx-auto max-w-4xl px-4 py-16 text-center sm:px-6 sm:py-24 lg:px-10">
        <Badge>For independent diagnostic labs</Badge>
        <h1 className="mt-4 text-3xl font-semibold tracking-tight text-slate-900 sm:text-5xl">
          Run your diagnostic lab from one simple platform
        </h1>
        <p className="mx-auto mt-4 max-w-2xl text-base text-slate-600 sm:text-lg">
          Register patients, run tests, and deliver branded, professional reports — built for
          small and independent labs across India.
        </p>
        <div className="mt-8 flex flex-col items-center justify-center gap-3 sm:flex-row">
          <Link to="/signup">
            <Button size="lg">Start your 14-day free trial</Button>
          </Link>
          <Link to="/login">
            <Button size="lg" variant="secondary">
              Log in to your lab
            </Button>
          </Link>
        </div>
        <p className="mt-3 text-xs text-slate-500">No payment required to start.</p>
      </section>

      {/* Features */}
      <section className="mx-auto max-w-7xl px-4 pb-16 sm:px-6 lg:px-10">
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {features.map((feature) => (
            <Card key={feature.title} className="p-6">
              <span className="flex h-10 w-10 items-center justify-center rounded-lg bg-teal-50 text-teal-700">
                <feature.icon className="h-5 w-5" aria-hidden="true" />
              </span>
              <h3 className="mt-4 font-semibold text-slate-900">{feature.title}</h3>
              <p className="mt-1.5 text-sm text-slate-600">{feature.description}</p>
            </Card>
          ))}
        </div>
      </section>

      {/* Pricing */}
      <section className="border-t border-slate-200 bg-white py-16">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-10">
          <div className="mx-auto max-w-2xl text-center">
            <h2 className="text-2xl font-semibold tracking-tight text-slate-900 sm:text-3xl">
              Simple, subscription-based pricing
            </h2>
            <p className="mt-3 text-sm text-slate-600 sm:text-base">
              Every lab starts with a free 14-day trial. When you're ready, choose the plan
              duration that fits your lab.
            </p>
          </div>

          <div className="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {plans.map((plan) => (
              <Card
                key={plan.name}
                className={`flex flex-col p-6 ${
                  plan.highlight ? "border-2 border-teal-500 shadow-md" : ""
                }`}
              >
                {plan.highlight && (
                  <Badge tone="success" className="mb-3 w-fit">
                    Most popular
                  </Badge>
                )}
                <h3 className="text-lg font-semibold text-slate-900">{plan.name}</h3>
                <p className="text-sm text-slate-500">{plan.duration}</p>
                <p className="mt-4 text-2xl font-semibold tracking-tight text-slate-900">
                  {plan.price}
                </p>
                <p className="mt-3 flex-1 text-sm text-slate-600">{plan.description}</p>
                <Link to="/signup" className="mt-6">
                  <Button
                    className="w-full justify-center"
                    variant={plan.highlight ? "primary" : "secondary"}
                  >
                    {plan.name === "Free Trial" ? "Start free trial" : "Get started"}
                  </Button>
                </Link>
              </Card>
            ))}
          </div>

          <p className="mt-6 text-center text-xs text-slate-500">
            Paid plan billing is handled directly with our team — reach out after your trial to
            continue.
          </p>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-slate-200 bg-slate-50 py-8">
        <div className="mx-auto max-w-7xl px-4 text-center text-sm text-slate-500 sm:px-6 lg:px-10">
          <Logo className="mx-auto mb-3 justify-center" />
          <p>Built for independent diagnostic laboratories.</p>
        </div>
      </footer>
    </div>
  );
}

export default Landing;