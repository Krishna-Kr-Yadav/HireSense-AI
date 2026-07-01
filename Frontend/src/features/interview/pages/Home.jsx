import React,{useEffect, useState,useRef} from 'react'
import '../style/home.scss'
import { useInterview } from '../hooks/useInterview'
import { useNavigate } from 'react-router'

const Home = () => {
    const {loading,generateReport,reports,getReports} = useInterview()

    const [jobDescription,setJobDescription] = useState("")
    const [selfDescription,setSelfDescription] = useState("")
    const [resumeError,setResumeError] = useState("")
    const resumeInputRef = useRef()
    const navigate = useNavigate()

    useEffect(() => {
        getReports()
    }, [getReports])

    const handleGenerateReport = async () => {
        const resumeFile = resumeInputRef.current.files[0]

        if(!resumeFile){
            setResumeError('Please upload a resume before generating the interview strategy.')
            return
        }

        setResumeError('')
        
        const data = await generateReport({jobDescription,selfDescription,resumeFile})

        navigate(`/interview/${data._id}`)
    }

    if(loading){
        return (
            <main className='loading-screen'>
                <h1>Loading your interview plan...</h1>
            </main>
        )
    }
  return (
        <main className='home'>
            <div className='home__ambient home__ambient--left' aria-hidden='true' />
            <div className='home__ambient home__ambient--right' aria-hidden='true' />

            <section className='home__hero'>
                <h1>
                    Create Your Custom <span>Interview Plan</span>
                </h1>
                <p className='home__subtitle'>
                    Let our AI analyze the job requirements and your profile to build a focused strategy.
                </p>

                <div className='interview-input-group'>
                    <section className='panel panel--job'>
                        <div className='panel__header'>
                            <div>
                                <p className='panel__kicker'>Target Job Description</p>
                            </div>
                            <span className='panel__badge panel__badge--required'>Required</span>
                        </div>

                        <label className='field field--textarea' htmlFor='jobDescription'>
                            <span className='sr-only'>Job Description</span>
                            <textarea
                                onChange={(e)=>{setJobDescription(e.target.value)}}
                                name='jobDescription'
                                id='jobDescription'
                                placeholder="Paste the full job description here... e.g. 'Senior Frontend Engineer at Google requires proficiency in React, TypeScript, and large-scale system design...'"
                            />
                            <span className='field__count'>0 / 5000 characters</span>
                        </label>
                    </section>

                    <section className='panel panel--profile'>
                        <div className='panel__header'>
                            <div>
                                <p className='panel__kicker'>Your Profile</p>
                            </div>
                        </div>

                        <div className='stack stack--compact'>
                            <div className='panel__row'>
                                <span className='panel__label'>Upload Resume</span>
                                <span className='panel__badge panel__badge--optional'>Optional</span>
                            </div>

                            <label className='dropzone' htmlFor='resume'>
                                <input ref={resumeInputRef} hidden id='resume' className='sr-only' type='file' name='resume' accept='.pdf,.doc,.docx' />
                                <span className='dropzone__icon' aria-hidden='true'>
                                    <svg viewBox='0 0 24 24' fill='none' aria-hidden='true'>
                                        <path d='M12 16V8m0 0-3 3m3-3 3 3' stroke='currentColor' strokeWidth='1.8' strokeLinecap='round' strokeLinejoin='round' />
                                        <path d='M20 15.5A4.5 4.5 0 0 0 15.5 11h-.6A5.5 5.5 0 1 0 6 16.5' stroke='currentColor' strokeWidth='1.8' strokeLinecap='round' strokeLinejoin='round' />
                                        <path d='M8.5 16.5H8' stroke='currentColor' strokeWidth='1.8' strokeLinecap='round' />
                                    </svg>
                                </span>
                                <span className='dropzone__title'>Click to upload or drag &amp; drop</span>
                                <span className='dropzone__meta'>PDF or DOCX (Max 10MB)</span>
                            </label>
                        </div>

                        <div className='divider'>
                            <span>or</span>
                        </div>

                        <label className='field field--textarea field--small' htmlFor='selfDescription'>
                            <span className='panel__label'>Quick Self-Description</span>
                            <textarea
                                onChange={(e)=>{setSelfDescription(e.target.value)}}
                                name='selfDescription'
                                id='selfDescription'
                                placeholder="Shortly describe your experience, key skills, and years of experience if you don't have a resume handy..."
                            />
                        </label>

                        <div className='info-card'>
                            <span className='info-card__dot' aria-hidden='true' />
                            <p>Either a Resume or a Self Description is required to generate a personalized plan.</p>
                        </div>

                        {resumeError && (
                            <p className='field-error' role='alert'>
                                {resumeError}
                            </p>
                        )}
                    </section>
                </div>

                <div className='home__footer'>
                    <p>AI-Powered Strategy Generation - Approx. 30s</p>
                    <button
                        onClick={handleGenerateReport}
                        className='button primary-button home__cta'>
                        Generate My Interview Strategy
                    </button>
                </div>

                {reports.length>0 && (
                    <section className='recent-reports'>
                        <h2>My Recent Interview Plans</h2>
                        <ul className='reports-list'>
                            {
                                reports.map(report =>(
                                    <li key={report._id} className='report-item' onClick={() => navigate(`/interview/${report._id}`)}>
                                        <div className='report-item__top'>
                                            <h3>{report.title || 'Untitled Interview Plan'}</h3>
                                            <span className={`match-score ${report.matchScore >= 80 ? 'score--high' : report.matchScore >= 60 ? 'score--mid' : 'score--low'}`}>
                                                {typeof report.matchScore === 'number' ? `${report.matchScore}% match` : 'No score'}
                                            </span>
                                        </div>
                                        <p className='report-meta'>
                                            Generated on{' '}
                                            {report.createdAt
                                                ? new Date(report.createdAt).toLocaleDateString()
                                                : 'Unknown date'}
                                        </p>
                                    </li>
                                ))
                            }
                        </ul>
                    </section>
                )}

                <nav className='home__links' aria-label='Footer links'>
                    <a href='#'>Privacy Policy</a>
                    <a href='#'>Terms of Service</a>
                    <a href='#'>Help Center</a>
                </nav>

            </section>
    </main>
  )
}

export default Home
