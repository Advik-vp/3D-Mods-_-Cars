import styles from './page.module.css';

const standards = [
  {
    code: 'ISO 26262',
    title: 'Road Vehicles - Functional Safety',
    desc: 'An international standard for functional safety of electrical and/or electronic systems installed in serial production road vehicles. Crucial for modifications that interact with vehicle electronics.'
  },
  {
    code: 'ISO 9001',
    title: 'Quality Management Systems',
    desc: 'Ensures that automotive parts and modification services meet customer and regulatory requirements consistently, maintaining high quality.'
  },
  {
    code: 'ISO 14001',
    title: 'Environmental Management',
    desc: 'Helps automotive modders minimize how their operations negatively affect the environment and comply with applicable laws and regulations.'
  },
  {
    code: 'ISO 21434',
    title: 'Cybersecurity Engineering',
    desc: 'Essential for modern smart cars. Ensures that any electronic modifications do not compromise the cybersecurity of the vehicle networks.'
  },
  {
    code: 'ISO 3779',
    title: 'Vehicle Identification Number (VIN)',
    desc: 'Specifies the content and structure of a VIN in order to establish a uniform identification system for road vehicles worldwide.'
  },
  {
    code: 'ISO 16750',
    title: 'Environmental Testing',
    desc: 'Environmental testing and durability benchmarking for vehicle electronics.'
  },
  {
    code: 'ISO 6469',
    title: 'Electric Vehicle Safety',
    desc: 'Safety requirements tailored strictly for electrically propelled road vehicles, crucial for EV modifications.'
  },
  {
    code: 'ISO 4513',
    title: 'Automotive Paint Coatings',
    desc: 'Standards for evaluating the physical, chemical, and durability properties of automotive body paint coatings.'
  }
];

export default function IsoStandards() {
  return (
    <div className={styles.container}>
      <header className={styles.header}>
        <h1 className={styles.title}>Indian Automotive ISO Standards</h1>
        <p className={styles.subtitle}>
          Compliance and safety are paramount in automotive customization. Learn about the key ISO standards regulating modifications for Indian road vehicles.
        </p>
      </header>

      <div className={styles.grid}>
        {standards.map(std => (
          <div key={std.code} className={`glass-panel ${styles.standardCard}`}>
            <div className={styles.badge}>{std.code}</div>
            <div className={styles.content}>
              <h2>{std.title}</h2>
              <p>{std.desc}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
