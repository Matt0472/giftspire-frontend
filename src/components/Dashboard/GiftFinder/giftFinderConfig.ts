import type { Relation, Occasion } from '@/types/giftSearch'

export interface OptionItem {
  value: string
  icon: string
  labelKey: string
}

export interface RelationOption extends OptionItem {
  value: Relation
}

export interface OccasionOption extends OptionItem {
  value: Occasion
}

// Relations with icons
export const relations: RelationOption[] = [
  { value: 'girlfriend', icon: '💝', labelKey: 'giftFinder.relations.girlfriend' },
  { value: 'boyfriend', icon: '💙', labelKey: 'giftFinder.relations.boyfriend' },
  { value: 'wife', icon: '💍', labelKey: 'giftFinder.relations.wife' },
  { value: 'husband', icon: '🤵', labelKey: 'giftFinder.relations.husband' },
  { value: 'mother', icon: '👩', labelKey: 'giftFinder.relations.mother' },
  { value: 'father', icon: '👨', labelKey: 'giftFinder.relations.father' },
  { value: 'friend', icon: '🤝', labelKey: 'giftFinder.relations.friend' },
  { value: 'colleague', icon: '💼', labelKey: 'giftFinder.relations.colleague' },
  { value: 'brother', icon: '👦', labelKey: 'giftFinder.relations.brother' },
  { value: 'sister', icon: '👧', labelKey: 'giftFinder.relations.sister' },
  { value: 'daughter', icon: '👧', labelKey: 'giftFinder.relations.daughter' },
  { value: 'son', icon: '👦', labelKey: 'giftFinder.relations.son' },
  { value: 'boss', icon: '👔', labelKey: 'giftFinder.relations.boss' },
  { value: 'coworker', icon: '🤝', labelKey: 'giftFinder.relations.coworker' },
  { value: 'neighbor', icon: '🏘️', labelKey: 'giftFinder.relations.neighbor' },
  { value: 'teacher', icon: '📚', labelKey: 'giftFinder.relations.teacher' }
]

// Occasions with icons
export const occasions: OccasionOption[] = [
  { value: 'birthday', icon: '🎂', labelKey: 'giftFinder.occasions.birthday' },
  { value: 'christmas', icon: '🎄', labelKey: 'giftFinder.occasions.christmas' },
  { value: 'valentine', icon: '💘', labelKey: 'giftFinder.occasions.valentine' },
  { value: 'anniversary', icon: '💑', labelKey: 'giftFinder.occasions.anniversary' },
  { value: 'graduation', icon: '🎓', labelKey: 'giftFinder.occasions.graduation' },
  { value: 'wedding', icon: '💒', labelKey: 'giftFinder.occasions.wedding' },
  { value: 'mothers_day', icon: '🌷', labelKey: 'giftFinder.occasions.mothersDay' },
  { value: 'fathers_day', icon: '👔', labelKey: 'giftFinder.occasions.fathersDay' },
  { value: 'housewarming', icon: '🏠', labelKey: 'giftFinder.occasions.housewarming' },
  { value: 'baby_shower', icon: '🍼', labelKey: 'giftFinder.occasions.babyShower' },
  { value: 'retirement', icon: '🏖️', labelKey: 'giftFinder.occasions.retirement' },
  { value: 'promotion', icon: '📈', labelKey: 'giftFinder.occasions.promotion' },
  { value: 'just_because', icon: '💫', labelKey: 'giftFinder.occasions.justBecause' }
]

// Interests with icons
export const interests: OptionItem[] = [
  { value: 'technology', icon: '💻', labelKey: 'giftFinder.interests.technology' },
  { value: 'gadgets', icon: '📱', labelKey: 'giftFinder.interests.gadgets' },
  { value: 'fashion', icon: '👗', labelKey: 'giftFinder.interests.fashion' },
  { value: 'beauty', icon: '💄', labelKey: 'giftFinder.interests.beauty' },
  { value: 'sports', icon: '⚽', labelKey: 'giftFinder.interests.sports' },
  { value: 'fitness', icon: '💪', labelKey: 'giftFinder.interests.fitness' },
  { value: 'gaming', icon: '🎮', labelKey: 'giftFinder.interests.gaming' },
  { value: 'books', icon: '📚', labelKey: 'giftFinder.interests.books' },
  { value: 'music', icon: '🎵', labelKey: 'giftFinder.interests.music' },
  { value: 'cooking', icon: '🍳', labelKey: 'giftFinder.interests.cooking' },
  { value: 'travel', icon: '✈️', labelKey: 'giftFinder.interests.travel' },
  { value: 'art', icon: '🎨', labelKey: 'giftFinder.interests.art' },
  { value: 'photography', icon: '📷', labelKey: 'giftFinder.interests.photography' },
  { value: 'outdoor', icon: '🏕️', labelKey: 'giftFinder.interests.outdoor' },
  { value: 'pets', icon: '🐾', labelKey: 'giftFinder.interests.pets' },
  { value: 'home-decor', icon: '🏡', labelKey: 'giftFinder.interests.homeDecor' }
]
