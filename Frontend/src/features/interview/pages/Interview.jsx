import React from 'react'
import '../style/interview.scss'
import { useInterview } from '../hooks/useInterview'
import { useParams } from 'react-router'

const Interview = () => {
  const [activeSection, setActiveSection] = React.useState('technical')
  const { report, loading, getReportById, getResumePdf } = useInterview()
  const { interviewId } = useParams()

  React.useEffect(() => {
    if (interviewId) {
      getReportById(interviewId)
    }
  }, [interviewId, getReportById])

  const technicalQuestions = report?.technicalQuestions ?? []
  const behaviouralQuestions = report?.behaviouralQuestionS ?? report?.behaviouralQuestions ?? []
  const preparationPlan = report?.preparationPlan ?? []
  const skillGaps = report?.skillGaps ?? []

  if (loading || !report) {
    return (
      <main className='interview interview--loading'>
        <div className='interview__loading-card'>
          <h1>Loading interview report...</h1>
        </div>
      </main>
    )
  }

  const sections = {
    technical: {
      title: 'Technical Questions',
      items: technicalQuestions.map((question, index) => ({
        title: question.question,
        question: question.question,
        intention: question.intention,
        answer: question.answer,
      })),
    },
    behavioural: {
      title: 'Behavioural Questions',
      items: behaviouralQuestions.map((question, index) => ({
        title: question.question,
        question: question.question,
        intention: question.intention,
        answer: question.answer,
      })),
    },
    roadmap: {
      title: 'Roadmap',
      subtitle: '7-day plan',
      items: preparationPlan.map((day) => ({
        day: day.day,
        focus: day.focus,
        tasks: day.tasks,
      })),
    },
  }

  const activeContent = sections[activeSection]

  return (
    <main className='interview'>
      <div className='interview__ambient interview__ambient--left' aria-hidden='true' />
      <div className='interview__ambient interview__ambient--right' aria-hidden='true' />

      <section className='interview__shell'>
        <section className='interview__frame' aria-label='Interview report layout'>
          <aside className='interview__sidebar interview__sidebar--left'>
            <div className='interview__sidebar-heading'>Sections</div>
            <nav className='section-nav' aria-label='Interview sections'>
              {Object.entries(sections).map(([key, section]) => (
                <button
                  key={key}
                  type='button'
                  className={`section-nav__item ${activeSection === key ? 'section-nav__item--active' : ''}`}
                  onClick={() => setActiveSection(key)}
                >
                  {section.title}
                </button>
              ))}
            </nav>
            <button
              onClick={ () => (getResumePdf(interviewId))}
             className="button primary-button">
              <svg height={"0.8rem"} style={{marginRight:"0.6rem"}} xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor"><path d="M10.6144 17.7956 11.492 15.7854C12.2731 13.9966 13.6789 12.5726 15.4325 11.7942L17.8482 10.7219C18.6162 10.381 18.6162 9.26368 17.8482 8.92277L15.5079 7.88394C13.7092 7.08552 12.2782 5.60881 11.5105 3.75894L10.6215 1.61673C10.2916.821765 9.19319.821767 8.8633 1.61673L7.97427 3.75892C7.20657 5.60881 5.77553 7.08552 3.97685 7.88394L1.63658 8.92277C.868537 9.26368.868536 10.381 1.63658 10.7219L4.0523 11.7942C5.80589 12.5726 7.21171 13.9966 7.99275 15.7854L8.8704 17.7956C9.20776 18.5682 10.277 18.5682 10.6144 17.7956ZM19.4014 22.6899 19.6482 22.1242C20.0882 21.1156 20.8807 20.3125 21.8695 19.8732L22.6299 19.5353C23.0412 19.3526 23.0412 18.7549 22.6299 18.5722L21.9121 18.2532C20.8978 17.8026 20.0911 16.9698 19.6586 15.9269L19.4052 15.3156C19.2285 14.8896 18.6395 14.8896 18.4628 15.3156L18.2094 15.9269C17.777 16.9698 16.9703 17.8026 15.956 18.2532L15.2381 18.5722C14.8269 18.7549 14.8269 19.3526 15.2381 19.5353L15.9985 19.8732C16.9874 20.3125 17.7798 21.1156 18.2198 22.1242L18.4667 22.6899C18.6473 23.104 19.2207 23.104 19.4014 22.6899Z"></path></svg>
              Download Resume
            </button>
          </aside>

          <section className='interview__content'>
            <div className='interview__content-header'>
              <div>
                <h2>{activeContent.title}</h2>
                <p>{activeSection === 'roadmap' ? '7-day plan' : 'Questions and guidance at a glance'}</p>
              </div>
              <span className='interview__content-count'>{activeContent.items.length} items</span>
            </div>

            {activeSection === 'roadmap' ? (
              <div className='timeline-list'>
                {activeContent.items.map((item) => (
                  <article className='timeline-item' key={item.day}>
                    <div className='timeline-item__marker' aria-hidden='true'>
                      <span />
                    </div>
                    <div className='timeline-item__content'>
                      <div className='timeline-item__head'>
                        <span className='timeline-item__day'>Day {item.day}</span>
                        <h3>{item.focus}</h3>
                      </div>
                      <ul className='timeline-item__tasks'>
                        {item.tasks.map((task) => (
                          <li key={task}>{task}</li>
                        ))}
                      </ul>
                    </div>
                  </article>
                ))}
              </div>
            ) : (
              <div className='content-list'>
                {activeContent.items.map((item, index) => (
                  <article className='content-list__item' key={`${item.title}-${index}`}>
                    <div className='content-list__meta'>
                      <span>{String(index + 1).padStart(2, '0')}</span>
                    </div>
                    <div className='content-list__body'>
                      <div className='qa-block'>
                        <span className='qa-block__label qa-block__label--question'>Question</span>
                        <h3>{item.title}</h3>
                        <p>{item.question || item.title}</p>
                      </div>
                      <div className='qa-block'>
                        <span className='qa-block__label'>Intention</span>
                        <p>{item.intention}</p>
                      </div>
                      {(activeSection === 'technical' || activeSection === 'behavioural') && item.answer && (
                        <div className='qa-block'>
                          <span className='qa-block__label qa-block__label--answer'>Answer</span>
                          <p>{item.answer}</p>
                        </div>
                      )}
                    </div>
                  </article>
                ))}
              </div>
            )}
          </section>

          <aside className='interview__sidebar interview__sidebar--right'>
            <div className='interview__sidebar-heading interview__sidebar-heading--center'>Match Score</div>
            <div className='score-ring'>
              <div className='score-ring__inner'>
                <strong>{report.matchScore}</strong>
                <span>%</span>
              </div>
            </div>
            <p className='score-note'>Strong match for this role</p>

            <div className='interview__sidebar-heading interview__sidebar-heading--center'>Skill Gaps</div>
            <div className='gap-list'>
              {skillGaps.map((gap) => (
                <div className={`gap-chip gap-chip--${gap.severity}`} key={gap.skill}>
                  {gap.skill}
                </div>
              ))}
            </div>
          </aside>
        </section>
      </section>
    </main>
  )
}

export default Interview
