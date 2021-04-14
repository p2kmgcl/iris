import Spinner from '../../atoms/Spinner';
import { BannerTitle } from '../../atoms/BannerTitle';
import { View } from '../../atoms/View';

export default function DeveloperTab() {
  return (
    <View fixedWidth>
      <BannerTitle>Colors</BannerTitle>
      <View>
        {['main', 'primary', 'highlight', 'accent', 'disabled', 'contrast'].map(
          (variant) => (
            <div
              key={variant}
              style={{
                backgroundColor: `var(--${variant}-background)`,
                boxShadow: '0 0 0 1px var(--border-color)',
                padding: 'var(--spacing-unit)',
              }}
            >
              <div style={{ color: `var(--${variant}-color)` }}>
                {`${variant.charAt(0).toUpperCase()}${variant.substr(1)}`}
              </div>
              <div
                style={{
                  color: `var(--${variant}-color-secondary)`,
                  fontSize: 'var(--font-size-small)',
                }}
              >
                Secondary 2
              </div>
            </div>
          ),
        )}
      </View>

      <BannerTitle>Transition duration</BannerTitle>
      <View padded>
        <Spinner size="large" spinning />
      </View>
    </View>
  );
}
