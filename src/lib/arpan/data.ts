import community from '@/assets/community.jpg';
import learning from '@/assets/learning.jpg';
import kitchen from '@/assets/kitchen.jpg';
import digital from '@/assets/digital.jpg';
export const images = { community, learning, kitchen, digital };
export type Kind = 'seva' | 'needs' | 'offers' | 'institutions';
export type Entry = { id: string; kind: Kind; title: string; context: string; category: string; location: string; image?: string | undefined; date: string; time: string; duration: string; organizer: string; spaces: number; recurring: boolean; verified: boolean; privacy: string; help: string; };
const sevaRows = [
 ['Saturday Learning Circle','A little time together can make learning feel less lonely. Share a patient ear and help young adults find their confidence.','Teaching','Bengaluru',learning],
 ['Community Kitchen Seva','A meal tastes different when it is made together. Join neighbours to prepare and share a fresh community lunch.','Food','Bengaluru',kitchen],
 ['Digital Literacy for Senior Citizens','Staying connected should feel simple. Sit alongside older neighbours and explore everyday technology at their pace.','Elder Care','Bengaluru',digital],
 ['Park Restoration Morning','Make a little space for nature, and for each other. Spend a morning planting and caring for our shared green space.','Environment','Bengaluru',community],
 ['Resume & Digital Skills Circle','Starting a new chapter is easier with company. Share practical experience with people preparing for their first job.','Skill Sharing','Pune',learning],
 ['Cloth Collection & Sorting','Thoughtfully sort clean clothing so community members can choose what works for them.','Cloth Donation','Mumbai',undefined],
 ['Elder Care Visit','Sometimes the most meaningful thing we offer is an unhurried conversation.','Elder Care','Delhi',digital],
 ['Neighbourhood Clean-up','Care for the streets we share with a friendly morning of neighbourhood cleaning.','Cleaning','Pune',community],
 ['Community Health Day','Support a welcoming health awareness circle with registration and accessible information.','Health','Chennai',undefined],
 ['Bicycle Repair Together','Bring your practical curiosity to a morning of repairing everyday bicycles with neighbours.','Miscellaneous','Bengaluru',undefined],
 ['Weekend Language Exchange','Make space for different languages and stories. Practise Hindi, Kannada and English together.','Skill Sharing','Online',learning],
];
const needRows = [
 ['Digital literacy support','I would like to feel more confident using online services. A patient person to practise with would help.','Technology','Bengaluru'],
 ['Laptop for college studies','I am beginning my next semester and need a working laptop for assignments. A refurbished one would be welcome.','Education','Pune'],
 ['Community food support','Our neighbourhood kitchen is looking for ingredients for the coming weekend’s shared meal.','Food','Bengaluru'],
 ['Mobility assistance','I need a companion for a hospital appointment and help navigating the building.','Mobility','Delhi'],
 ['Help with scholarship forms','A second pair of eyes would help me finish an application with confidence.','Education','Chennai'],
 ['Books for a reading corner','Our community reading circle would welcome books in Marathi and English.','Resources','Mumbai'],
 ['Learning spoken English','I would appreciate a weekly conversation partner as I prepare for interviews.','Education','Online'],
 ['Transport for a clinic visit','I am looking for accessible transport to a scheduled appointment.','Mobility','Pune'],
 ['Help setting up a website','Our small learning centre needs a simple, accessible website.','Technology','Bengaluru'],
 ['Garden tools to share','We are caring for a neighbourhood garden and could use shared tools.','Environment','Bengaluru'],
];
const offerRows = [
 ['I can teach Python','Happy to learn alongside beginners and explain the basics, one small step at a time.','Technology','Online'],
 ['Smartphone help for older neighbours','I can offer a patient hour to practise video calls, maps and everyday phone settings.','Technology','Bengaluru'],
 ['A second pair of eyes for your resume','I can help you put your experience into words before your next application.','Skill Sharing','Online'],
 ['Transportation support','I have some time on weekends to accompany someone to a local appointment.','Mobility','Pune'],
 ['An hour of maths each Saturday','I enjoy making maths less intimidating through simple examples.','Teaching','Bengaluru'],
 ['Books ready for a new home','I have a small collection of English and Hindi books I would like to share.','Resources','Delhi'],
 ['Help with everyday documents','I can sit with you and work through forms and online applications.','Miscellaneous','Chennai'],
 ['A spare laptop to share','A working laptop is available for someone’s learning journey.','Resources','Mumbai'],
 ['I can help in a community kitchen','I can offer my time chopping, preparing and cleaning alongside others.','Food','Bengaluru'],
 ['Conversation in Kannada','I would be glad to practise everyday Kannada with someone new to the city.','Knowledge','Online'],
];
const institutionRows = [
 ['Sahaj Community Centre','A neighbourhood space for learning, sharing skills and finding company. Everyone has a place at the table.','Community','Bengaluru',learning],
 ['Ananda Elder Care Collective','Creating space for older adults to feel connected, heard and at home.','Elder Care','Bengaluru',digital],
 ['Sangam Community Kitchen','Neighbours coming together to cook, share and nourish a community.','Food','Pune',kitchen],
 ['Open Book Learning Trust','Making reading and lifelong learning welcoming and accessible.','Education','Delhi',learning],
 ['Green Together Foundation','Caring for shared green spaces through everyday community participation.','Environment','Mumbai',community],
];
function entries(rows: (string | undefined)[][], kind: Kind): Entry[] { return rows.map((row,i) => ({id:`${kind}-${i+1}`,kind,title:row[0] ?? '',context:row[1] ?? '',category:row[2] ?? '',location:row[3] ?? '',image:row[4],date: i%2 === 0 ? '2026-10-10' : '2026-10-11',time:i%2===0?'10:00 AM':'9:00 AM',duration:'2 hours',organizer:kind==='institutions' ? (row[0] ?? '') : 'Sahaj Community Centre',spaces:8+i,recurring:i%3===0,verified:i%4!==3,privacy:kind==='needs'?'Community-visible':'Public',help:kind==='needs'?'Time, practical support, or resources — offer what feels possible.':'Your time, presence and willingness to listen.'})); }
export const demoEntries = [...entries(sevaRows,'seva'),...entries(needRows,'needs'),...entries(offerRows,'offers'),...entries(institutionRows,'institutions')];
export const categories = ['Teaching','Food','Elder Care','Environment','Skill Sharing','Technology','Education','Mobility','Resources','Health','Cleaning','Cloth Donation','Miscellaneous'];
export const notifications = [
 {id:'n1',title:'Your Seva is this Saturday at 10 AM.',text:'Saturday Learning Circle · Sahaj Community Centre',type:'seva'},
 {id:'n2',title:'Someone responded to your Offer.',text:'A community member would like to learn Python with you.',type:'chat'},
 {id:'n3',title:'Your Need has been reviewed.',text:'Demo review completed. Your privacy choices remain unchanged.',type:'need'},
 {id:'n4',title:'A new Seva at a community you support.',text:'Ananda Elder Care Collective is hosting a digital learning circle.',type:'seva'},
 {id:'n5',title:'Your reflection is waiting.',text:'A quiet moment to look back on Community Kitchen Seva.',type:'reflection'},
];
