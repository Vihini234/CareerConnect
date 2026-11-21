import { useEffect, useMemo, useState } from "react";
import { NavLink, Route, Routes, useNavigate } from "react-router-dom";
import {
  LayoutDashboard, Search, Sparkles, Bookmark, FileText, UserRound,
  Settings, Bell, GraduationCap, LogOut, Menu, X, BriefcaseBusiness,
  MapPin, Clock3, BookmarkCheck, Plus, Trash2, ExternalLink, Building2
} from "lucide-react";
import { api, getToken } from "./services/api";
import "./App.css";

const emptyProfile = {
  name: "", email: "", phone: "", location: "", university: "", degree: "",
  graduationYear: "", careerInterest: "Quality Assurance", summary: "",
  skills: [], github: "", portfolio: ""
};

function App() {
  const [user, setUser] = useState(() => {
    try { return JSON.parse(localStorage.getItem("cc_user") || "null"); } catch { return null; }
  });
  const [menuOpen, setMenuOpen] = useState(false);
  const navigate = useNavigate();

  function onAuth(data) {
    localStorage.setItem("cc_token", data.token);
    localStorage.setItem("cc_user", JSON.stringify(data.user));
    setUser(data.user);
    navigate("/");
  }

  function logout() {
    localStorage.removeItem("cc_token");
    localStorage.removeItem("cc_user");
    setUser(null);
    navigate("/login");
  }

  if (!getToken() || !user) {
    return <AuthPage onAuth={onAuth} />;
  }

  const company = user.role === "company";
  const links = company
    ? [["/", "Company Dashboard", LayoutDashboard], ["/company", "Manage Jobs", BriefcaseBusiness], ["/company/applicants", "Applicants", FileText]]
    : [["/", "Dashboard", LayoutDashboard], ["/jobs", "Discover Jobs", Search], ["/recommendations", "Recommendations", Sparkles], ["/saved", "Saved Jobs", Bookmark], ["/applications", "My Applications", FileText], ["/profile", "My Profile", UserRound]];

  return (
    <div className="app-shell">
      <aside className={`sidebar ${menuOpen ? "sidebar-open" : ""}`}>
        <div className="brand-row">
          <div className="brand-mark">C</div><span>CareerConnect</span>
          <button className="icon-button mobile-close" onClick={() => setMenuOpen(false)} aria-label="Close menu"><X size={19}/></button>
        </div>
        <p className="side-label">MAIN MENU</p>
        <nav className="side-nav">
          {links.map(([to, label, Icon]) => (
            <NavLink key={to} to={to} end={to === "/"} onClick={() => setMenuOpen(false)} className={({isActive}) => `nav-link ${isActive ? "active" : ""}`}>
              <Icon size={18}/>{label}
            </NavLink>
          ))}
        </nav>
        {!company && <>
          <p className="side-label account-label">ACCOUNT</p>
          <NavLink to="/profile" className="nav-link"><UserRound size={18}/>My Profile</NavLink>
        </>}
        <div className="sidebar-bottom">
          <div className="help-box"><GraduationCap size={23}/><strong>Build your future</strong><p>Keep your profile updated to discover relevant opportunities.</p></div>
          <div className="sidebar-user">
            <div className="avatar">{(user.name || "U").slice(0,1).toUpperCase()}</div>
            <div className="user-meta"><strong>{user.name}</strong><span>{company ? "Company account" : "Student account"}</span></div>
            <button className="icon-button" onClick={logout} title="Log out" aria-label="Log out"><LogOut size={17}/></button>
          </div>
        </div>
      </aside>

      <main className="main-area">
        <header className="topbar">
          <button className="icon-button mobile-menu" onClick={() => setMenuOpen(true)} aria-label="Open menu"><Menu size={21}/></button>
          <div className="breadcrumb"><span>Pages / </span>{company ? "Company Portal" : "Career Workspace"}</div>
          <div className="top-actions"><Bell size={19}/><div className="top-avatar">{(user.name || "U").slice(0,1).toUpperCase()}</div></div>
        </header>
        <div className="page-wrap">
          <Routes>
            <Route path="/" element={<Dashboard user={user} company={company}/>} />
            <Route path="/jobs" element={<JobsPage />} />
            <Route path="/recommendations" element={<JobsPage recommended />} />
            <Route path="/saved" element={<SavedPage />} />
            <Route path="/applications" element={<ApplicationsPage />} />
            <Route path="/profile" element={<ProfilePage />} />
            <Route path="/company" element={<CompanyJobsPage />} />
            <Route path="/company/applicants" element={<CompanyApplicantsPage />} />
            <Route path="*" element={<Dashboard user={user} company={company}/>} />
          </Routes>
        </div>
      </main>
    </div>
  );
}

function AuthPage({ onAuth }) {
  const [mode, setMode] = useState("login");
  const [form, setForm] = useState({ name:"", email:"", password:"", role:"student" });
  const [error, setError] = useState("");
  const [busy, setBusy] = useState(false);

  async function submit(e) {
    e.preventDefault(); setError(""); setBusy(true);
    try {
      const data = await api(`/auth/${mode}`, { method:"POST", body:JSON.stringify(form) });
      onAuth(data);
    } catch (err) { setError(err.message); }
    finally { setBusy(false); }
  }

  return <div className="auth-page">
    <div className="auth-panel">
      <div className="brand-row auth-brand"><div className="brand-mark">C</div><span>CareerConnect</span></div>
      <p className="eyebrow">YOUR NEXT OPPORTUNITY STARTS HERE</p>
      <h1>{mode === "login" ? "Welcome back" : "Create your account"}</h1>
      <p className="muted">Discover internships, showcase your skills and grow your career.</p>
      <form onSubmit={submit} className="stack-form">
        {mode === "register" && <>
          <label>Full name<input required value={form.name} onChange={e=>setForm({...form,name:e.target.value})} placeholder="Your name"/></label>
          <label>Account type<select value={form.role} onChange={e=>setForm({...form,role:e.target.value})}><option value="student">Student</option><option value="company">Company</option></select></label>
        </>}
        <label>Email address<input required type="email" value={form.email} onChange={e=>setForm({...form,email:e.target.value})} placeholder="you@example.com"/></label>
        <label>Password<input required minLength="8" type="password" value={form.password} onChange={e=>setForm({...form,password:e.target.value})} placeholder="At least 8 characters"/></label>
        {error && <p className="error-text" role="alert">{error}</p>}
        <button className="primary-button full-button" disabled={busy}>{busy ? "Please wait..." : mode === "login" ? "Log in" : "Create account"}</button>
      </form>
      <p className="auth-switch">{mode === "login" ? "New to CareerConnect?" : "Already have an account?"} <button onClick={()=>{setMode(mode==="login"?"register":"login");setError("");}}>{mode==="login"?"Create an account":"Log in"}</button></p>
    </div>
    <div className="auth-art"><div className="art-orbit"><GraduationCap size={90}/></div><h2>Make your next move count.</h2><p>Find opportunities that match your ambition.</p></div>
  </div>;
}

function Dashboard({ user, company }) {
  const [jobs,setJobs] = useState([]);
  const [apps,setApps] = useState([]);
  const [saved,setSaved] = useState([]);
  useEffect(()=>{ if(company) return; Promise.all([api("/jobs"),api("/applications"),api("/jobs/saved")]).then(([j,a,s])=>{setJobs(j);setApps(a);setSaved(s);}).catch(()=>{}); },[company]);
  if(company) return <CompanyJobsPage />;
  return <>
    <section className="welcome-row"><div><p className="eyebrow">YOUR CAREER JOURNEY STARTS HERE</p><h1>Welcome back, {user.name.split(" ")[0]}! <span>✦</span></h1><p className="muted">Discover opportunities that match your skills and ambitions.</p></div><div className="welcome-icon"><GraduationCap size={48}/></div></section>
    <div className="stats-grid">
      <Stat icon={BriefcaseBusiness} label="Available Opportunities" value={jobs.length} tone="purple"/>
      <Stat icon={BookmarkCheck} label="Saved Opportunities" value={saved.length} tone="blue"/>
      <Stat icon={FileText} label="Applications Submitted" value={apps.length} tone="green"/>
    </div>
    <section className="completion-banner"><div className="completion-icon"><UserRound size={25}/></div><div className="completion-copy"><strong>Build your career profile</strong><p>Add your education, technical skills and projects to improve your recommendations.</p></div><NavLink to="/profile" className="outline-button">Complete Profile ↗</NavLink></section>
    <div className="section-title"><div><p className="eyebrow">HANDPICKED FOR YOU</p><h2>Latest opportunities</h2></div><NavLink to="/jobs">Explore all jobs →</NavLink></div>
    <JobGrid jobs={jobs.slice(0,3)} />
  </>;
}

function Stat({icon:Icon,label,value,tone}) {
  return <div className="stat-card"><div className={`stat-icon ${tone}`}><Icon size={22}/></div><div><p>{label}</p><h2>{value}</h2><span>Updated from your account</span></div></div>;
}

function JobsPage({ recommended=false }) {
  const [jobs,setJobs] = useState([]);
  const [search,setSearch] = useState("");
  const [category,setCategory] = useState("All Categories");
  const [location,setLocation] = useState("All Locations");
  const [workType,setWorkType] = useState("All Work Types");
  const [error,setError] = useState("");
  async function load() {
    try {
      const q = new URLSearchParams({search,category,location,workType});
      const data = await api(`/jobs?${q}`);
      setJobs(data); setError("");
    } catch(e) { setError(e.message); }
  }
  useEffect(()=>{load();},[]);
  const shown = useMemo(()=>recommended ? jobs.slice(0,6) : jobs,[jobs,recommended]);
  return <>
    <section className="page-heading"><p className="eyebrow">{recommended?"PERSONALISED DISCOVERY":"EXPLORE OPPORTUNITIES"}</p><h1>{recommended?"Recommended for you":"Discover internships"}</h1><p className="muted">Search roles, compare opportunities and find your next step.</p></section>
    <div className="filter-panel">
      <input aria-label="Search jobs" placeholder="Search job title, company or keyword..." value={search} onChange={e=>setSearch(e.target.value)} onKeyDown={e=>e.key==="Enter"&&load()}/>
      <select aria-label="Category filter" value={category} onChange={e=>setCategory(e.target.value)}><option>All Categories</option><option>Quality Assurance</option><option>Software Engineering</option><option>IT Support</option><option>Data Science</option><option>UI/UX Design</option><option>Cybersecurity</option></select>
      <input aria-label="Location filter" placeholder="Location" value={location==="All Locations"?"":location} onChange={e=>setLocation(e.target.value||"All Locations")}/>
      <select aria-label="Work type filter" value={workType} onChange={e=>setWorkType(e.target.value)}><option>All Work Types</option><option>Remote</option><option>Hybrid</option><option>On-site</option></select>
      <button className="primary-button" onClick={load}>Search Jobs</button>
    </div>
    {error && <p className="error-text">{error}</p>}
    <div className="section-title"><h2>{shown.length} opportunities found</h2></div>
    <JobGrid jobs={shown}/>
  </>;
}

function JobGrid({jobs}) {
  if(!jobs.length) return <div className="empty-state"><BriefcaseBusiness size={32}/><h3>No opportunities found yet</h3><p>Try changing your filters or check again when companies publish vacancies.</p></div>;
  return <div className="jobs-grid">{jobs.map(job=><JobCard key={job.id} job={job}/>)}</div>;
}

function JobCard({job}) {
  const [saved,setSaved] = useState(false);
  const [message,setMessage] = useState("");
  async function toggleSave() {
    try {
      if(saved) await api(`/jobs/${job.id}/save`,{method:"DELETE"});
      else await api(`/jobs/${job.id}/save`,{method:"POST"});
      setSaved(!saved); setMessage(saved?"Removed from saved jobs":"Saved successfully");
    } catch(e) { setMessage(e.message); }
  }
  async function apply() {
    const coverNote = window.prompt("Add a short note to the employer (optional):") || "";
    try { const result=await api(`/jobs/${job.id}/apply`,{method:"POST",body:JSON.stringify({coverNote})}); setMessage(result.message); }
    catch(e) { setMessage(e.message); }
  }
  return <article className="job-card">
    <div className="job-card-top"><div className="company-logo">{(job.company_name||"C").slice(0,1)}</div><button className={`bookmark-button ${saved?"is-saved":""}`} onClick={toggleSave} aria-label="Save opportunity"><Bookmark size={18}/></button></div>
    <p className="company-name">{job.company_name}</p><h3>{job.title}</h3>
    <div className="job-meta"><span><MapPin size={14}/>{job.location}</span><span><Clock3 size={14}/>{job.work_type}</span></div>
    <p className="job-description">{job.description}</p>
    <div className="tag-row">{(job.skills||[]).map(s=><span key={s}>{s}</span>)}</div>
    <div className="job-card-footer"><span>{job.stipend||"Stipend not specified"}</span><button onClick={apply}>Apply now ↗</button></div>
    {message && <p className="inline-message" role="status">{message}</p>}
  </article>;
}

function SavedPage() {
  const [jobs,setJobs] = useState([]);
  const [error,setError] = useState("");
  async function load(){try{setJobs(await api("/jobs/saved"));}catch(e){setError(e.message);}}
  useEffect(()=>{load();},[]);
  return <><section className="page-heading"><p className="eyebrow">YOUR SHORTLIST</p><h1>Saved opportunities</h1><p className="muted">Review the internships you bookmarked.</p></section>{error&&<p className="error-text">{error}</p>}<JobGrid jobs={jobs}/></>;
}

function ApplicationsPage() {
  const [items,setItems] = useState([]);
  const [error,setError] = useState("");
  useEffect(()=>{api("/applications").then(setItems).catch(e=>setError(e.message));},[]);
  return <><section className="page-heading"><p className="eyebrow">APPLICATION TRACKER</p><h1>My applications</h1><p className="muted">Follow the progress of your submitted applications.</p></section>{error&&<p className="error-text">{error}</p>}
    <div className="table-card"><table><thead><tr><th>Position</th><th>Company</th><th>Location</th><th>Applied</th><th>Status</th></tr></thead><tbody>{items.map(a=><tr key={a.id}><td>{a.title}</td><td>{a.company_name}</td><td>{a.location}</td><td>{String(a.applied_at).slice(0,10)}</td><td><span className="status-pill">{a.status}</span></td></tr>)}</tbody></table>{!items.length&&<p className="table-empty">You haven't submitted any applications yet.</p>}</div>
  </>;
}

function ProfilePage() {
  const [form,setForm] = useState(emptyProfile);
  const [skill,setSkill] = useState("");
  const [message,setMessage] = useState("");
  const [error,setError] = useState("");
  useEffect(()=>{api("/profile").then(p=>setForm({...emptyProfile,...p,graduationYear:p.graduation_year||"",github:p.github_url||"",portfolio:p.portfolio_url||"",skills:p.skills||[]})).catch(e=>setError(e.message));},[]);
  function update(e){setForm({...form,[e.target.name]:e.target.value});}
  function addSkill(){if(skill.trim()&&!form.skills.includes(skill.trim()))setForm({...form,skills:[...form.skills,skill.trim()]});setSkill("");}
  async function save(e){e.preventDefault();setMessage("");setError("");try{const data=await api("/profile",{method:"PUT",body:JSON.stringify(form)});setMessage(data.message);}catch(e){setError(e.message);}}
  return <><section className="page-heading"><p className="eyebrow">YOUR PROFESSIONAL IDENTITY</p><h1>My Student Profile</h1><p className="muted">Share your background, skills and projects with potential employers.</p></section>
    <form className="form-card" onSubmit={save}>
      <h2>Personal information</h2><div className="form-grid">
        <label>Full name<input name="name" value={form.name} onChange={update} required/></label>
        <label>Email<input value={form.email} disabled/></label>
        <label>Phone<input name="phone" value={form.phone||""} onChange={update}/></label>
        <label>Location<input name="location" value={form.location||""} onChange={update} placeholder="Colombo, Sri Lanka"/></label>
      </div>
      <label>Professional summary<textarea name="summary" value={form.summary||""} onChange={update} rows="3" placeholder="Introduce yourself and your career goals."/></label>
      <h2>Education and career interests</h2><div className="form-grid">
        <label>University<input name="university" value={form.university||""} onChange={update}/></label>
        <label>Degree<input name="degree" value={form.degree||""} onChange={update}/></label>
        <label>Graduation year<input name="graduationYear" value={form.graduationYear||""} onChange={update}/></label>
        <label>Career interest<select name="careerInterest" value={form.careerInterest||"Quality Assurance"} onChange={update}><option>Quality Assurance</option><option>Software Engineering</option><option>IT Support</option><option>Data Science</option><option>UI/UX Design</option><option>Cybersecurity</option></select></label>
      </div>
      <h2>Technical skills</h2><div className="skill-add"><input value={skill} onChange={e=>setSkill(e.target.value)} placeholder="Add a skill"/><button type="button" className="secondary-button" onClick={addSkill}><Plus size={16}/> Add</button></div>
      <div className="tag-row">{form.skills.map(s=><span key={s}>{s}<button type="button" onClick={()=>setForm({...form,skills:form.skills.filter(x=>x!==s)})}>×</button></span>)}</div>
      <h2>Portfolio links</h2><div className="form-grid"><label>GitHub URL<input name="github" type="url" value={form.github||""} onChange={update}/></label><label>Portfolio URL<input name="portfolio" type="url" value={form.portfolio||""} onChange={update}/></label></div>
      {message&&<p className="success-text" role="status">{message}</p>}{error&&<p className="error-text" role="alert">{error}</p>}
      <button className="primary-button" type="submit">Save profile</button>
    </form>
  </>;
}

function CompanyJobsPage() {
  const [jobs,setJobs] = useState([]);
  const [form,setForm] = useState({title:"",category:"Quality Assurance",location:"",workType:"Hybrid",description:"",requirements:"",skills:"",stipend:"",deadline:""});
  const [message,setMessage] = useState("");
  const [error,setError] = useState("");
  async function load(){try{setJobs(await api("/company/jobs"));}catch(e){setError(e.message);}}
  useEffect(()=>{load();},[]);
  async function publish(e){e.preventDefault();setMessage("");setError("");try{await api("/company/jobs",{method:"POST",body:JSON.stringify({...form,skills:form.skills.split(",").map(s=>s.trim()).filter(Boolean)})});setMessage("Opportunity published.");setForm({...form,title:"",location:"",description:"",requirements:"",skills:"",stipend:"",deadline:""});load();}catch(e){setError(e.message);}}
  async function remove(id){try{await api(`/company/jobs/${id}`,{method:"DELETE"});load();}catch(e){setError(e.message);}}
  return <><section className="page-heading"><p className="eyebrow">EMPLOYER WORKSPACE</p><h1>Company Dashboard</h1><p className="muted">Publish internships and manage your opportunities.</p></section>
    <form className="form-card" onSubmit={publish}><h2>Post an opportunity</h2><div className="form-grid">
      <label>Job title *<input required value={form.title} onChange={e=>setForm({...form,title:e.target.value})} placeholder="QA Engineer Intern"/></label>
      <label>Category<select value={form.category} onChange={e=>setForm({...form,category:e.target.value})}><option>Quality Assurance</option><option>Software Engineering</option><option>IT Support</option><option>Data Science</option><option>UI/UX Design</option><option>Cybersecurity</option></select></label>
      <label>Location *<input required value={form.location} onChange={e=>setForm({...form,location:e.target.value})} placeholder="Colombo / Remote"/></label>
      <label>Work type<select value={form.workType} onChange={e=>setForm({...form,workType:e.target.value})}><option>Remote</option><option>Hybrid</option><option>On-site</option></select></label>
      <label>Stipend<input value={form.stipend} onChange={e=>setForm({...form,stipend:e.target.value})} placeholder="e.g. LKR 30,000"/></label>
      <label>Application deadline<input type="date" value={form.deadline} onChange={e=>setForm({...form,deadline:e.target.value})}/></label>
    </div><label>Description *<textarea required rows="3" value={form.description} onChange={e=>setForm({...form,description:e.target.value})}/></label><label>Requirements<textarea rows="2" value={form.requirements} onChange={e=>setForm({...form,requirements:e.target.value})}/></label><label>Skills (comma separated)<input value={form.skills} onChange={e=>setForm({...form,skills:e.target.value})} placeholder="Playwright, JavaScript, API Testing"/></label>
    {message&&<p className="success-text">{message}</p>}{error&&<p className="error-text">{error}</p>}<button className="primary-button">Publish opportunity</button></form>
    <div className="section-title"><h2>Your published opportunities</h2></div><div className="table-card"><table><thead><tr><th>Position</th><th>Category</th><th>Location</th><th>Action</th></tr></thead><tbody>{jobs.map(j=><tr key={j.id}><td>{j.title}</td><td>{j.category}</td><td>{j.location}</td><td><button className="text-danger" onClick={()=>remove(j.id)}><Trash2 size={15}/> Delete</button></td></tr>)}</tbody></table>{!jobs.length&&<p className="table-empty">You have not published any opportunities yet.</p>}</div>
  </>;
}

function CompanyApplicantsPage() {
  const [apps,setApps] = useState([]);
  const [error,setError] = useState("");
  async function load(){try{setApps(await api("/applications/company"));}catch(e){setError(e.message);}}
  useEffect(()=>{load();},[]);
  async function changeStatus(id,status){try{await api(`/applications/${id}/status`,{method:"PATCH",body:JSON.stringify({status})});load();}catch(e){setError(e.message);}}
  return <><section className="page-heading"><p className="eyebrow">TALENT MANAGEMENT</p><h1>Applicants</h1><p className="muted">Review applications and update candidate progress.</p></section>{error&&<p className="error-text">{error}</p>}<div className="table-card"><table><thead><tr><th>Candidate</th><th>Email</th><th>Position</th><th>Current status</th><th>Update status</th></tr></thead><tbody>{apps.map(a=><tr key={a.id}><td>{a.student_name}</td><td>{a.email}</td><td>{a.title}</td><td>{a.status}</td><td><select value={a.status} onChange={e=>changeStatus(a.id,e.target.value)}><option>Submitted</option><option>Under Review</option><option>Shortlisted</option><option>Rejected</option><option>Accepted</option></select></td></tr>)}</tbody></table>{!apps.length&&<p className="table-empty">No applications have been received yet.</p>}</div></>;
}

export default App;
