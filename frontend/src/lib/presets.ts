/* eslint-disable @typescript-eslint/no-explicit-any */
export interface ContractPreset {
  id: string;
  name: string;
  type: string;
  description: string;
  rawText: string;
  analysis: any; // Follows the AI JSON schema
}

export const PRESETS: ContractPreset[] = [
  {
    id: "employment-agreement",
    name: "Predatory Tech Employment Agreement",
    type: "Employment Contract",
    description: "A standard-looking developer employment agreement containing aggressive non-competes, forced arbitration, and full intellectual property grabs.",
    rawText: `EMPLOYMENT AGREEMENT

This Employment Agreement ("Agreement") is entered into as of January 15, 2026, by and between CyberCore Systems Inc., a Delaware corporation ("Employer"), and John Doe, an individual ("Employee").

1. DUTIES AND AVAILABILITY. The Employee is hired as a Senior Software Engineer. The Employee agrees to devote their full professional time, energy, and undivided loyalty to the Employer. Given the fast-paced nature of CyberCore’s operations, the Employee agrees to be available for duty twenty-four (24) hours a day, seven (7) days a week, including holidays, as dictated by operational needs, without additional compensation beyond the base salary.

2. INTELLECTUAL PROPERTY AND ASSIGNMENT. The Employee hereby irrevocably assigns, transfers, and conveys to the Employer all right, title, and interest worldwide in and to any and all inventions, designs, software, code, algorithms, patents, trade secrets, and other intellectual property ("Developments") conceived, created, written, or reduced to practice by the Employee during the term of employment. This assignment applies universally, whether such Developments are created during standard business hours, on the Employer’s premises, or entirely on the Employee's own personal time, using the Employee's own equipment, and regardless of whether the Developments relate directly or indirectly to the Employer's current or anticipated business operations.

3. COVENANT NOT TO COMPETE (NON-COMPETE). During the term of employment and for a period of twenty-four (24) months following the termination of employment for any reason (whether voluntary or involuntary), the Employee shall not, directly or indirectly, engage in, perform services for, consult for, advise, or be employed by any business, entity, or individual anywhere in the world that competes, directly or indirectly, with the business of CyberCore Systems Inc., or any of its subsidiaries, affiliates, or anticipated business lines.

4. INDEMNIFICATION. The Employee agrees to defend, indemnify, and hold harmless the Employer, its officers, and directors against any and all claims, liabilities, losses, damages, or expenses (including reasonable attorneys' fees) arising out of or resulting from the Employee's performance of duties, negligence, or breach of this Agreement.

5. FORCED ARBITRATION AND GOVERNING LAW. This Agreement shall be governed by the laws of the State of Delaware, without regard to conflict of laws principles. Any dispute, controversy, or claim arising out of or relating to this Agreement, including the breach, termination, or validity thereof, as well as any claims of wrongful termination or discrimination, shall be settled exclusively by binding arbitration administered by a single arbitrator selected solely by the Employer. The arbitration shall take place exclusively in Wilmington, Delaware. The Employee hereby waives any right to a trial by jury or to participate in any class action lawsuit. All costs of arbitration, including the arbitrator's fee, shall be split equally between the parties, regardless of the outcome.`,
    analysis: {
      documentName: "Predatory Tech Employment Agreement",
      documentType: "employment",
      overallRiskScore: 89,
      summary: "This employment agreement is extremely one-sided, offering severe liabilities and restrictions to the employee. Key concerns include a 24/7 availability mandate without extra compensation, an absolute IP grab extending to your personal time and projects, a global 24-month non-compete, and a restrictive arbitration clause situated in Delaware where the arbitrator is selected solely by the employer.",
      riskBreakdown: {
        financial: "Medium",
        ipOwnership: "Critical",
        restrictiveCovenants: "Critical",
        liability: "High",
        termination: "Medium"
      },
      clauses: [
        {
          id: "clause_1",
          title: "24/7 Availability Mandate",
          severity: "High",
          originalText: "Employee agrees to be available for duty twenty-four (24) hours a day, seven (7) days a week, including holidays, as dictated by operational needs, without additional compensation beyond the base salary.",
          translation: "You must be available to work 24/7, including weekends and holidays, whenever the company wants, and you won't get paid any overtime or extra compensation for it.",
          hiddenTrap: "By agreeing to 'undivided loyalty' and '24/7 availability', you forfeit reasonable work-life balance boundaries. In some jurisdictions, this might violate labor laws, but signing it gives the company massive leverage to overwork you under threat of breach of contract.",
          practicalImplication: "The company can text you at 3:00 AM on Christmas Day demanding immediate bug fixes. If you do not respond or refuse to work, they can fire you for cause due to breach of this clause.",
          counterProposal: "Replace with: 'The Employee's standard working hours shall be 40 hours per week, Monday through Friday. Any work required outside of these standard hours must be mutually agreed upon in writing and compensated at a standard overtime rate or offset by compensatory time off.'"
        },
        {
          id: "clause_2",
          title: "All-Inclusive Intellectual Property Grab",
          severity: "Critical",
          originalText: "This assignment applies universally, whether such Developments are created during standard business hours, on the Employer’s premises, or entirely on the Employee's own personal time, using the Employee's own equipment, and regardless of whether the Developments relate directly or indirectly to the Employer's current or anticipated business operations.",
          translation: "Anything you build, write, design, or code—even on your weekends, using your own laptop, in your own house, and totally unrelated to your day job—belongs entirely to the company.",
          hiddenTrap: "Standard IP assignments limit ownership to things built *for* the company, during work hours, or using company equipment. This clause grabs *everything*, meaning a side-project mobile game you build in your free time belongs 100% to them.",
          practicalImplication: "If you develop a side-project SaaS tool on your own computer on weekends and it becomes successful, CyberCore Systems Inc. can sue you, assert full ownership, and seize all your profits.",
          counterProposal: "Replace with: 'This assignment shall only apply to Developments created: (a) during the Employee's standard working hours, (b) on the Employer's premises using the Employer's equipment, or (c) that directly relate to the Employer's current business operations or specific R&D projects.'"
        },
        {
          id: "clause_3",
          title: "2-Year Global Non-Compete",
          severity: "Critical",
          originalText: "During the term of employment and for a period of twenty-four (24) months following the termination of employment for any reason (whether voluntary or involuntary), the Employee shall not, directly or indirectly, engage in, perform services for, consult for, advise, or be employed by any business, entity, or individual anywhere in the world that competes, directly or indirectly, with the business of CyberCore Systems Inc., or any of its subsidiaries, affiliates, or anticipated business lines.",
          translation: "For 2 years after leaving this company (even if they fire you), you cannot work for any competitor or start any competing business anywhere in the world.",
          hiddenTrap: "A 24-month duration is exceptionally long, and a 'global' territory is excessively broad. Furthermore, it covers 'anticipated business lines', which is highly ambiguous and can prevent you from working in almost any modern tech sector.",
          practicalImplication: "If you leave the company or get laid off, you are legally blocked from taking another developer job at any tech firm or starting your own company for two full years, effectively forcing you out of your career field.",
          counterProposal: "Request to delete this covenant entirely. Alternatively: 'The non-compete shall be limited to six (6) months, restricted to a fifty (50) mile radius of the Employer's offices, and apply solely to direct competitors whose primary business is identical to the Employer's active core product.'"
        },
        {
          id: "clause_4",
          title: "Employee-Paid Indemnification",
          severity: "High",
          originalText: "The Employee agrees to defend, indemnify, and hold harmless the Employer, its officers, and directors against any and all claims, liabilities, losses, damages, or expenses (including reasonable attorneys' fees) arising out of or resulting from the Employee's performance of duties, negligence, or breach of this Agreement.",
          translation: "If the company gets sued because of something you did at work, or if they claim you breached this agreement, you have to pay for all their legal defense fees and any damages they lose.",
          hiddenTrap: "Indemnification should flow from the employer to the employee (protecting the worker from lawsuits arising from doing their job). Reversing this is highly predatory, putting massive personal financial liability on an individual employee.",
          practicalImplication: "If a client sues the company claiming a bug in your code caused them financial damage, the company can turn around and force you to pay their legal defense costs and any court settlement out of your personal savings.",
          counterProposal: "Strike this clause entirely. Replace with a Mutual Indemnification or Employer Indemnification clause: 'The Employer shall indemnify, defend, and hold the Employee harmless against any and all third-party claims, liabilities, or losses arising from the Employee's performance of their standard duties under this Agreement.'"
        },
        {
          id: "clause_5",
          title: "Unilateral Employer-Selected Arbitration",
          severity: "High",
          originalText: "Any dispute... shall be settled exclusively by binding arbitration administered by a single arbitrator selected solely by the Employer. The arbitration shall take place exclusively in Wilmington, Delaware... All costs of arbitration... shall be split equally between the parties, regardless of the outcome.",
          translation: "If you want to sue the company for something like unpaid wages, you cannot go to a real court. You must go to private arbitration in Delaware, the arbitrator is chosen entirely by the company, and you must pay half the expensive arbitration fees.",
          hiddenTrap: "By letting the employer select the single arbitrator, you face severe bias (the 'repeat player' effect). Forcing a split of fees (which can be $5,000+ per day) prevents employees from ever filing a claim because it is too expensive.",
          practicalImplication: "If the company refuses to pay you your last month's salary of $5,000, you cannot sue them in local small claims court. You must travel to Delaware, pay $10,000+ in shared arbitration fees, and plead your case to an arbitrator hand-picked by the company.",
          counterProposal: "Replace with: 'Any disputes shall be settled by binding arbitration in the Employee's home state, administered by a neutral agency (like AAA or JAMS) in accordance with its consumer/employment rules, with all arbitrator fees paid solely by the Employer.'"
        }
      ],
      simulations: [
        {
          scenario: "Voluntary Resignation for a Higher-Paying Job",
          outcome: "Under Section 3, resigning to work for any software firm anywhere in the world will trigger a breach of the 2-year non-compete. CyberCore could file an injunction to force your new employer to fire you and sue you for damages.",
          severity: "Critical"
        },
        {
          scenario: "Developing an Independent Side Project Mobile App",
          outcome: "Under Section 2, even if built on weekends on your own laptop, the app and its intellectual property are automatically owned by CyberCore. If it makes money, they can claim the revenue and code.",
          severity: "Critical"
        },
        {
          scenario: "Refusing a 4:00 AM Call on a Sunday",
          outcome: "Under Section 1, you have agreed to be available 24/7. Refusing to answer or work can be cited as a direct breach of contract, allowing the company to terminate you 'for cause' and deny you any severance.",
          severity: "Warning"
        }
      ],
      negotiationCheatsheet: [
        {
          point: "Limit IP Assignment to Work-Related Inventions",
          recommendation: "Ensure side projects are protected by restricting the intellectual property transfer exclusively to items created during standard business hours and directly related to company business.",
          emailTemplate: "Regarding Section 2 (Intellectual Property), I would like to modify the wording so that the assignment of Developments is restricted to those created during standard working hours, using company equipment, or directly related to the company's active products. This ensures my personal hobby projects created on my own time and equipment remain separate."
        },
        {
          point: "Eliminate or Shorten Non-Compete",
          recommendation: "Request that the non-compete be entirely deleted. If they refuse, negotiate to reduce it to a standard 6-month period restricted to direct competitors in your local geographical area.",
          emailTemplate: "Regarding Section 3, a 24-month worldwide non-compete is highly restrictive and would make it difficult for me to secure future employment in my field in the event of separation. I would like to request that this clause be removed, or alternatively, limited to a duration of 6 months and restricted to direct competitors within a 50-mile radius."
        },
        {
          point: "Establish Neutral, Employer-Paid Arbitration",
          recommendation: "Request that arbitration be administered by an independent body (such as AAA) with a mutually selected neutral arbitrator, and that the employer covers arbitrator fees to prevent cost-barrier blocks.",
          emailTemplate: "Regarding Section 5 (Arbitration), to ensure mutual fairness in any dispute resolution, I request that the arbitrator be selected from a neutral association like JAMS or AAA by mutual agreement, that the proceedings take place in my home state, and that arbitration costs are handled in accordance with standard AAA employment rules where the employer covers arbitrator fees."
        }
      ]
    }
  },
  {
    id: "freelance-agreement",
    name: "Exploitative Freelance Service Agreement",
    type: "Freelance Contract",
    description: "A freelance vendor contract with predatory payment delays, unlimited indemnity clauses, and complete intellectual property handover before payment is made.",
    rawText: `FREELANCE SERVICES AGREEMENT

This Agreement is entered into by and between Acme Global Corp ("Client") and Creative Studios LLC ("Contractor") for design services.

1. DELIVERABLES AND SERVICES. The Contractor shall deliver website design assets as requested. The Contractor agrees that all work must meet the Client’s subjective and sole satisfaction. If the Client, in its sole discretion, deems any deliverable unsatisfactory, the Client may reject the work, and the Contractor shall rewrite or redesign the asset indefinitely without further compensation.

2. PAYMENT TERMS AND NET 90. Compensation for approved deliverables shall be paid on a Net 90 basis. The 90-day payment clock shall commence only after: (a) the work has been subjectively approved by the Client, (b) the Client has successfully launched the project commercially, and (c) the Contractor has submitted an invoice. No interest, late fees, or penalties shall accrue on delayed payments.

3. OWNERSHIP AND INTELLECTUAL PROPERTY. The Contractor agrees that all deliverables, mockups, ideas, source files, and draft work shall be deemed "Works Made For Hire" under copyright law. All intellectual property rights shall vest in the Client immediately upon creation. This transfer of ownership is absolute and immediate, regardless of whether the Client has paid the Contractor’s invoices. The Client reserves the right to use, modify, sell, or distribute the deliverables without paying the Contractor if the work is rejected.

4. UNLIMITED INDEMNIFICATION AND LIABILITY. The Contractor agrees to indemnify, defend, and hold harmless the Client and its clients against any and all damages, claims, third-party disputes, or losses arising from the deliverables. The Contractor's liability under this section shall be unlimited and shall extend to indirect, consequential, punitive, and incidental damages. The Contractor agrees to maintain a liability insurance policy of no less than $2,000,000 to cover these potential obligations.`,
    analysis: {
      documentName: "Exploitative Freelance Service Agreement",
      documentType: "freelance",
      overallRiskScore: 92,
      summary: "This contract exposes a freelance developer or designer to extreme financial and legal risk. Key dangers include a 'subjective satisfaction' clause that allows the client to demand infinite free reworks, an atrocious 'Net 90' payment clause that delays compensation until after commercial launch, an immediate IP transfer before you are actually paid, and an unlimited indemnification clause holding you liable for millions in third-party damages.",
      riskBreakdown: {
        financial: "Critical",
        ipOwnership: "Critical",
        restrictiveCovenants: "Neutral",
        liability: "Critical",
        termination: "High"
      },
      clauses: [
        {
          id: "clause_1",
          title: "Infinite Subjective Reworks",
          severity: "High",
          originalText: "If the Client, in its sole discretion, deems any deliverable unsatisfactory, the Client may reject the work, and the Contractor shall rewrite or redesign the asset indefinitely without further compensation.",
          translation: "If the client decides they don't like your design—for any personal, subjective reason—they can reject it and make you redo it forever without paying you a single cent more.",
          hiddenTrap: "Subjective satisfaction clauses are highly dangerous. Without an objective checklist of requirements or a limit on revision rounds (e.g., maximum 2 rounds of edits), you can be trapped doing infinite free labor.",
          practicalImplication: "You design a gorgeous homepage. The client says 'it doesn't feel right' and rejects it. You are legally obligated to create completely new concepts over and over again for free, or you will be sued for breach of contract.",
          counterProposal: "Replace with: 'The Client is entitled to up to two (2) rounds of revisions based on the initial project brief. Any additional revisions, changes in scope, or work beyond the original requirements will be billed at the Contractor's standard hourly rate of $100/hr.'"
        },
        {
          id: "clause_2",
          title: "90-Day Payment Delay (Net 90 After Launch)",
          severity: "Critical",
          originalText: "Compensation for approved deliverables shall be paid on a Net 90 basis. The 90-day payment clock shall commence only after: (a) the work has been subjectively approved by the Client, (b) the Client has successfully launched the project commercially, and (c) the Contractor has submitted an invoice.",
          translation: "You will not get paid until at least 3 months AFTER the client approves your work and commercially launches their website. If they delay the launch, you never get paid, and they won't pay late fees.",
          hiddenTrap: "Tying payment to subjective approval AND commercial launch is predatory. Commercial launch is entirely out of your control (the client could delay launch for a year). Net 90 is an exceptionally long cashflow delay.",
          practicalImplication: "You finish the website in January. The client approves it but delays the public launch until October because of marketing strategy. You won't receive payment until January of the *following year* (12 months later).",
          counterProposal: "Replace with: 'Payment shall be made on a Net 30 basis from the date of invoice submission. Invoices shall be submitted upon completion of milestones. Late payments shall accrue interest at a rate of 1.5% per month.'"
        },
        {
          id: "clause_3",
          title: "IP Transfer Without Payment Guarantee",
          severity: "Critical",
          originalText: "All intellectual property rights shall vest in the Client immediately upon creation. This transfer of ownership is absolute and immediate, regardless of whether the Client has paid the Contractor’s invoices.",
          translation: "The client owns all your designs, source files, and ideas the second you create them, even if they never pay your invoices. They can also use your rejected drafts for free.",
          hiddenTrap: "As a contractor, your only real leverage is your ownership of the copyright. If you hand over the IP before getting paid, you lose all leverage. If the client refuses to pay, you cannot force them to stop using your work because they already own it.",
          practicalImplication: "The client receives your source code, refuses to pay your $10,000 invoice claiming they aren't 'satisfied', launches the site using your code, and you cannot file a copyright takedown request because they legally own it.",
          counterProposal: "Replace with: 'All intellectual property, copyrights, and ownership rights in the deliverables shall transfer to the Client exclusively upon receipt of full and final payment of all outstanding invoices by the Contractor.'"
        },
        {
          id: "clause_4",
          title: "Unlimited Liability and Punitive Damages",
          severity: "Critical",
          originalText: "The Contractor agrees to indemnify... The Contractor's liability under this section shall be unlimited and shall extend to indirect, consequential, punitive, and incidental damages. The Contractor agrees to maintain a liability insurance policy of no less than $2,000,000...",
          translation: "If anything goes wrong, you must pay for everything, including their lost profits, punitive damages, and legal battles. There is no limit to how much money they can sue you for, and they force you to buy expensive $2M insurance.",
          hiddenTrap: "Unlimited liability can ruin a freelancer. Consequential damages (like lost business profits if a website crashes) can amount to millions. Standard freelance agreements limit liability to the total amount paid under the contract.",
          practicalImplication: "A server outage occurs on the website you designed, causing the client to lose $100,000 in sales. Under this clause, they can sue you for the $100,000 lost profits, plus punitive damages, even if your total contract was only worth $2,000.",
          counterProposal: "Replace with: 'In no event shall the Contractor be liable for any indirect, consequential, or punitive damages. The Contractor's total liability under this Agreement shall be strictly capped at the total amount actually paid to the Contractor by the Client under this Agreement.'"
        }
      ],
      simulations: [
        {
          scenario: "Client refuses to pay and launches the website anyway",
          outcome: "Under Section 3, they already own the IP immediately upon creation. You cannot legally demand they take down the website or claim copyright infringement. You must hire an attorney and sue them in court for payment, which could cost more than the invoice.",
          severity: "Critical"
        },
        {
          scenario: "Client delays launch by 6 months",
          outcome: "Under Section 2, the Net 90 payment timer does not start until after commercial launch. You will be left unpaid for at least 9 months without any legal right to charge interest or late fees.",
          severity: "Critical"
        },
        {
          scenario: "A font used in the design is claimed to infringe copyright by a third party",
          outcome: "Under Section 4, you have agreed to unlimited indemnification. You will be personally liable for all the client's legal fees and damages, which could easily exceed $50,000, even if you used a licensed font in good faith.",
          severity: "Critical"
        }
      ],
      negotiationCheatsheet: [
        {
          point: "IP Transfer Tied to Payment",
          recommendation: "Insist that the copyright and intellectual property transfer only takes effect once the final invoice is paid in full.",
          emailTemplate: "Regarding Section 3, I would like to adjust the language to state that the transfer of intellectual property rights in the deliverables will take effect only upon receipt of full and final payment for the services. This is standard industry practice to ensure security for both parties."
        },
        {
          point: "Cap Liability to Project Fees",
          recommendation: "Request a standard cap on liability equal to the amount paid to you, and explicitly exclude consequential or punitive damages.",
          emailTemplate: "Regarding Section 4, as a freelance contractor, I cannot take on unlimited liability or consequential damages. I request that my liability under this contract be capped at the total fees paid under this agreement, and that consequential and punitive damages be excluded."
        },
        {
          point: "Change payment terms to Net 30",
          recommendation: "Change payment terms from Net 90 after launch to Net 30 upon invoice, and add standard late fee interest of 1.5% per month.",
          emailTemplate: "Regarding Section 2, a Net 90 payment term tied to project launch presents a major cashflow challenge. I request that the payment terms be revised to Net 30 from the date of invoice submission, independent of when the client commercially launches the project."
        }
      ]
    }
  },
  {
    id: "terms-of-service",
    name: "Predatory Platform Terms & Privacy Policy",
    type: "Platform Agreement / Terms",
    description: "A subscription software agreement with hidden auto-renew penalties, unilateral term modification, and extensive data tracking/selling terms.",
    rawText: `LEMONSTREAM PLATFORM TERMS OF SERVICE

Welcome to LemonStream. By subscribing, you agree to these Terms.

1. AUTO-RENEWAL AND CANCELLATION BARRIER. Subscriptions are billed on an annual basis ($299/yr) and shall automatically renew for successive 1-year terms. To cancel, the Subscriber must submit a signed, physical written notice via certified registered mail to the Provider’s legal office in Wyoming no less than sixty (60) days prior to the renewal date. E-mail or in-app cancellations are strictly invalid and will not be processed. If cancellation is submitted late, the Subscriber is liable for the full subsequent annual fee as a liquidation penalty.

2. UNILATERAL AMENDMENT OF TERMS. The Provider reserves the right, in its sole discretion, to modify, amend, or alter these Terms, its pricing structures, and its service features at any time without prior direct notice to the Subscriber. Continued use of the platform following any modifications constitutes absolute acceptance of the revised Terms and pricing. It is the sole responsibility of the Subscriber to manually review these Terms weekly.

3. PRIVACY AND DATA HARVESTING. The Provider collects real-time location data, device identifiers, contact lists, web browsing history, and audio recordings from the device's microphone during platform execution. The Subscriber hereby grants the Provider an absolute, irrevocable, perpetual, worldwide license to package, aggregate, share, rent, and sell this data to third-party data brokers, advertising agencies, and corporate affiliates for commercial purposes.`,
    analysis: {
      documentName: "LemonStream Platform Terms of Service",
      documentType: "terms",
      overallRiskScore: 95,
      summary: "This subscription contract contains highly abusive platform practices. It locks users into annual auto-renewals with an intentional cancellation barrier (requiring physical certified mail to Wyoming 60 days in advance), permits the company to change pricing and terms unilaterally without telling you, and harvests and sells highly intrusive personal data including web history, contact lists, and active microphone audio recordings.",
      riskBreakdown: {
        financial: "Critical",
        ipOwnership: "Neutral",
        restrictiveCovenants: "Neutral",
        liability: "High",
        termination: "Critical"
      },
      clauses: [
        {
          id: "clause_1",
          title: "certified Mail Cancellation Trap",
          severity: "Critical",
          originalText: "To cancel, the Subscriber must submit a signed, physical written notice via certified registered mail to the Provider’s legal office in Wyoming no less than sixty (60) days prior to the renewal date. E-mail or in-app cancellations are strictly invalid...",
          translation: "To stop paying, you cannot just click 'cancel' online or email them. You must mail a physical letter to Wyoming by certified post at least 2 months before your subscription renews. If you miss this deadline, you are locked in for another full year.",
          hiddenTrap: "This is a classic 'dark pattern' designed to prevent users from cancelling. Certified mail requires going to a post office, which adds massive friction. The 60-day deadline is also unusually long, raising the chances that you will miss it.",
          practicalImplication: "You decide to cancel your subscription three weeks before it auto-renews. You click a cancel button online or email customer service. They ignore it, bill your card $299, and legally defend the charge because you didn't mail a letter to Wyoming 60 days ago.",
          counterProposal: "Ensure the platform supports easy, modern, in-app digital cancellations. If negotiating standard enterprise agreements: 'Subscriber may cancel the subscription at any time via the online account settings dashboard or by sending a simple email notice to support@lemonstream.com, effective immediately at the end of the current billing cycle.'"
        },
        {
          id: "clause_2",
          title: "Surprise Unilateral Price & Term Changes",
          severity: "High",
          originalText: "The Provider reserves the right... to modify, amend, or alter these Terms, its pricing structures... at any time without prior direct notice to the Subscriber... Continued use... constitutes absolute acceptance... It is the sole responsibility of the Subscriber to manually review these Terms weekly.",
          translation: "The company can change their prices, add penalties, or change rules whenever they want, without telling you. If you keep using the app, you automatically agree. You have to go to their website and check the fine print every single week.",
          hiddenTrap: "Unilateral modifications without notice are abusive. Good-faith contracts require at least 30 days prior email notice before any material changes or price increases, allowing the user to opt-out if they disagree.",
          practicalImplication: "LemonStream raises their annual subscription fee from $299 to $2,999 overnight without emailing you. Because you used the app the next day, you have 'agreed' to the new price, and they charge your credit card $2,999.",
          counterProposal: "Replace with: 'Provider shall provide at least thirty (30) days prior written notice via email to the Subscriber of any material changes to these Terms or pricing. If the Subscriber does not agree to the changes, they have the right to cancel their subscription without penalty prior to the effective date of the changes.'"
        },
        {
          id: "clause_3",
          title: "Extremely Intrusive Data Selling (Microphone & Browsing)",
          severity: "Critical",
          originalText: "The Provider collects real-time location data, device identifiers, contact lists, web browsing history, and audio recordings from the device's microphone... license to package, aggregate, share, rent, and sell this data to third-party data brokers...",
          translation: "The app spies on your GPS location, reads your phone contacts, steals your browser history, and listens to your microphone. They sell all this private data to advertising brokers and other companies for pure profit.",
          hiddenTrap: "This is a massive surveillance and privacy violation disguised as standard terms. There is no legitimate functional reason for a subscription service to harvest microphone audio or web browsing history and sell it to data brokers.",
          practicalImplication: "While the app runs in the background, it records conversations in your home, tracks your web searches, and sells this profile to brokers. You start seeing hyper-targeted ads everywhere about private conversations you had in your living room.",
          counterProposal: "Insist on strict data privacy standard clauses: 'Provider shall only collect personal data strictly necessary for the technical operation of the platform, shall never record audio without explicit user permission, and shall not sell, rent, or trade user personal data to third parties under any circumstances.'"
        }
      ],
      simulations: [
        {
          scenario: "Trying to cancel online 10 days before renewal",
          outcome: "Online cancellation will be ignored under Section 1. You will be billed $299 for the next year. If you dispute the charge with your credit card company, LemonStream will present this contract to win the dispute and send your account to collections.",
          severity: "Critical"
        },
        {
          scenario: "A sudden 500% subscription price increase",
          outcome: "Under Section 2, the price hike is fully legal without notifying you. By simply logging into the platform after the change, you are deemed to have legally accepted the $1,500 bill.",
          severity: "Critical"
        },
        {
          scenario: "Confidential company data spoken near the device",
          outcome: "Under Section 3, they have a legal perpetual license to record microphone audio and sell it to third parties, presenting an extreme corporate espionage or trade secret leak risk.",
          severity: "Critical"
        }
      ],
      negotiationCheatsheet: [
        {
          point: "Opt-Out of Data Selling & Audio Recording",
          recommendation: "Ensure that microphone access is restricted, and add a clause explicitly banning the selling of personal data.",
          emailTemplate: "Regarding Section 3 (Privacy), I request that we remove the clauses allowing the collection of microphone audio, contact lists, and web browsing history, and modify the language to state that the Provider will not rent, share, or sell user data to third parties."
        },
        {
          point: "Add 30-Day Notice for Price/Terms Changes",
          recommendation: "Do not accept unilateral changes without notice. Demand at least 30 days prior email notification with opt-out rights.",
          emailTemplate: "Regarding Section 2, I would like to request that any material changes to the Terms of Service or pricing structures require a 30-day prior written notice via email, with the right for the subscriber to terminate their account prior to the change taking effect."
        },
        {
          point: "Standard Digital Cancellation",
          recommendation: "Ensure cancellations can be completed in-app or via email without physical mail or multi-month advance limits.",
          emailTemplate: "Regarding Section 1, I request that the cancellation terms be updated to allow standard digital cancellation within the app dashboard or via email, with no certified physical mail requirement, effective at the end of the current paid billing cycle."
        }
      ]
    }
  }
];
