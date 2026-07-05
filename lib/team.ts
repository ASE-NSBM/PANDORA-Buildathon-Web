import type { Member } from '@/components/ui/MemberCards'

/** Organizing committee — shown on the home page and the contact page. */
export const committee: Member[] = [
  { role: 'President',      name: 'Samsudeen Ashad',        email: 'samsudeenashad@gmail.com', image: '/team/ashad.jpg' },
  { role: 'Vice President', name: 'Nethum Bashitha',        email: 'bashithanethum4@gmail.com', image: '/team/nethum.jpg' },
  { role: 'Vice President', name: 'Dilara Wickramanayake',  email: 'dilarawickramanayake@gmail.com', image: '/team/dilara.jpg' },
  { role: 'Secretary',      name: 'Hirushi Nethmini',       email: 'hirushinethmini5@gmail.com', image: '/team/hirushi.jpeg' },
]

/** Development team — shown only on the contact page. */
export const developmentTeam: Member[] = [
  { role: 'Chief Technical Affairs',     name: 'Rashmika Fernando',    image: '/team/rashmika.jpg' },
  { role: 'Development Lead — Powerteam', name: 'Zenith Ivan',          image: '/team/zenith.jpg' },
  { role: 'Development Lead — 24 Batch',  name: 'Himath Bandara',       image: '/team/himath.jpg' },
  { role: 'Development Lead — 25 Batch',  name: 'Shamika Keshan',       image: '/team/keshan.jpg' },
  { role: 'Development Lead — 26 Batch',  name: 'Ramiru Wanigathunga',  image: '/team/ramiru.jpg' },
]
